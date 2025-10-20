## WanderLanka Monorepo — Architecture and APIs

This repository contains WanderLanka’s microservices, API Gateway, and web/mobile applications. This README gives a concise overview of the architecture, service responsibilities, how requests flow through the system, and the primary API inputs and outputs exposed via the gateway.

### High-level Architecture
- **Clients**: `wanderlanka-web-app` (Vite/React) and `wanderlanka-mobile-app` (Expo/React Native)
- **API Gateway**: Central entrypoint that provides routing, security (helmet, rate limiting, auth), CORS, logging, health checks, and reverse-proxying to services.
- **Microservices**: Independent services for Authentication, Booking (tour guide reservations), Transport (vehicles), Accommodation (hotels/rooms), Complaints, etc. Each service exposes a `/health` endpoint and their own resource endpoints.
- **Infra**: `wanderlanka-infra` with Docker Compose and RabbitMQ scaffolding.

Request flow:
1. Client calls `API Gateway` at `/api/...`.
2. Gateway authenticates/limits and proxies to the target service based on the path.
3. Service processes request (often with MongoDB) and returns JSON. Gateway streams the response back to the client.

### API Gateway
Location: `api-gateway/`

- Entrypoint: `api-gateway/server.js`
- Routes mapping: `api-gateway/routes/proxyRoutes.js`

Gateway base URL (local): `http://localhost:<gateway_port>`

Gateway public paths → service targets:
- `/api/auth/*` → Auth Service
- `/api/booking/*` → Booking Service (protected)
- `/api/payment/*` → Payment Service (protected + strict limiter) [if enabled]
- `/api/complaints/*` → Complaint Service (protected)
- `/api/transport/*` → Transport Service (optional auth)
- `/api/accommodation/*` → Accommodation Service (optional auth)
- `/api/guide/*` → Guide Service (optional auth) [subset of booking]
- `/api/itinerary/*` → Itinerary Service [if enabled]
- `/api/listing/*` → Listing Service (optional auth) [if enabled]

Health:
- `GET /health`
- `GET /health/detailed`

Notes:
- Global security via `helmet`, general rate limiting, CORS, and structured request logging.
- Services are health-checked periodically by an in-memory registry (`utils/serviceRegistry.js`).

### Services and APIs (via Gateway)
Below are the primary routes proxied by the gateway, their expected inputs, and typical outputs. Replace `<GATEWAY>` with your API Gateway origin, e.g., `http://localhost:8080`.

#### 1) Authentication Service
Base (through gateway): `<GATEWAY>/api/auth`

- `POST /signup` — Register a user
  - Input (JSON):
    - `email` (string), `password` (string, min length per validator), `role` (string: traveler|guide|admin), `firstName` (string), `lastName` (string)
  - Output (200/201 JSON):
    - `user`: `{ id, email, role, firstName, lastName }`
    - `tokens`: `{ accessToken, refreshToken }`

- `POST /login` — Authenticate
  - Input (JSON): `email`, `password`
  - Output (200 JSON): `{ user, tokens }` same shape as signup

- `POST /logout`
  - Input: Authorization bearer token (access token)
  - Output (200 JSON): `{ success: true }`

- `POST /refresh` — Issue new tokens
  - Input (JSON): `{ refreshToken }`
  - Output (200 JSON): `{ tokens: { accessToken, refreshToken } }`

- `GET /profile` — Get current user
  - Input: Authorization bearer token
  - Output (200 JSON): `{ id, email, role, firstName, lastName, ... }`

- `GET /verify-token`
  - Input: Authorization bearer token
  - Output (200 JSON): `{ valid: true, user: { ... } }`

Health: `GET <auth_service>/health` (service-local), or check via gateway detailed health.

#### 2) Booking Service (Tour Guide Reservations)
Base: `<GATEWAY>/api/booking/tourguide`
All endpoints require Authorization bearer token.

- `POST /reservations`
  - Input (JSON): `{ guideId, date, timeSlot, partySize, notes? }`
  - Output (201 JSON): `{ id, status: 'confirmed'|'pending', guideId, userId, date, timeSlot, partySize, createdAt }`

- `GET /reservations`
  - Query: optional filters like `status`, `dateFrom`, `dateTo`
  - Output (200 JSON): `{ items: [ { id, status, ... } ], total }`

- `GET /reservations/:id`
  - Output (200 JSON): `{ id, status, guideId, ... }`

- `PATCH /reservations/:id`
  - Input (JSON): partial updates, e.g. `{ status }` or `{ date, timeSlot }`
  - Output (200 JSON): updated reservation object

- `POST /reservations/:id/cancel`
  - Output (200 JSON): `{ id, status: 'cancelled' }`

Health: `GET <booking_service>/health` (service-local)

#### 3) Transport Service (Vehicles)
Base: `<GATEWAY>/api/transport`

- `GET /vehicles` — Authenticated user’s vehicles
  - Input: Authorization bearer token
  - Output (200 JSON): `{ items: [ { id, make, model, year, seats, ... } ] }`

- `GET /vehicles/all` — Public catalog
  - Output (200 JSON): `{ items: [ { id, make, model, year, seats, pricePerDay, ... } ] }`

- `GET /vehicles/:id` — Vehicle details
  - Output (200 JSON): `{ id, make, model, year, seats, ... }`

- `POST /vehicles` — Create vehicle (auth required)
  - Input (JSON): `{ make, model, year, seats, pricePerDay, photos? }`
  - Output (201 JSON): created vehicle object

- `PUT /vehicles/:id` — Update vehicle (auth required)
  - Input (JSON): updatable fields
  - Output (200 JSON): updated vehicle object

- `DELETE /vehicles/:id` — Delete vehicle (auth required)
  - Output (200/204)

Health: `GET <transport_service>/health` (service-local)

#### 4) Accommodation Service (Hotels/Rooms)
Base: `<GATEWAY>/api/accommodation`

- `GET /places` — List accommodations (auth required as coded)
  - Input: Authorization bearer token
  - Output (200 JSON): `{ items: [ { id, name, location, rating, ... } ] }`

- `GET /hotel/:id` — Accommodation details (auth required)
  - Output (200 JSON): `{ id, name, description, amenities, rooms, ... }`

- `POST /addhotels` — Create accommodation (auth required)
  - Input (JSON): `{ name, location, description, amenities, photos? }`
  - Output (201 JSON): created accommodation object

- `PUT /updatehotel/:id` — Update accommodation (auth required)
  - Input (JSON): updatable fields
  - Output (200 JSON): updated accommodation object

Rooms:
- `GET /places/:id` — Rooms by hotel id (auth required)
  - Output (200 JSON): `{ items: [ { id, type, price, capacity, ... } ] }`

- `GET /rooms/:id` — Room details (auth required)
  - Output (200 JSON): `{ id, type, price, amenities, ... }`

- `POST /addrooms` — Create room (auth required)
  - Input (JSON): `{ hotelId, type, price, capacity, photos? }`
  - Output (201 JSON): created room object

- `PUT /updateroom/:id` — Update room (auth required)
  - Input (JSON): updatable fields
  - Output (200 JSON): updated room object

Health: `GET <accommodation_service>/health` (service-local)

#### 5) Complaint Service
Base: `<GATEWAY>/api/complaints`

- `GET /health` — Public health
  - Output (200 JSON): `{ success: true, message, timestamp }`

- `POST /submit` — Submit complaint (auth required)
  - Input (JSON): `{ category, description, attachments?, orderId?, targetService? }`
  - Output (201 JSON): `{ id, status: 'open', userId, category, description, createdAt }`

- `GET /my-complaints` — List current user’s complaints (auth required)
  - Output (200 JSON): `{ items: [ { id, status, category, createdAt } ], total }`

- `GET /my-complaints/:id` — Complaint detail (auth required)
  - Output (200 JSON): complaint object

- Admin (auth + admin role):
  - `GET /admin/all` — `{ items: [...], total }`
  - `GET /admin/stats` — aggregate stats
  - `PUT /admin/:id/status` — Input: `{ status }` → Output: updated complaint

Health: `GET <complaint_service>/health` (public)

### Clients
- `wanderlanka-web-app`: React + Vite SPA hitting the gateway. See `src/services/*` for API calls and `src/pages` for screens (e.g., admin dashboard, complaints management).
- `wanderlanka-mobile-app`: Expo/React Native app using `services/api.ts`, `services/auth.ts`, etc., to call the gateway.

### Environment and Running Locally
Prereqs: Node.js 18+, MongoDB (local or cloud), npm

- Install dependencies (run per package):
  - `api-gateway/`, `user-service/`, `booking-service/`, `transport-service/`, `accommodation-service/`, `complaint-service/`, `wanderlanka-web-app/`, `wanderlanka-mobile-app/`

- Environment variables (examples; see each service’s `.env.example` or config):
  - Gateway: CORS origins, service URLs, rate limits
  - Auth: JWT secrets, DB connection
  - Booking/Transport/Accommodation/Complaint: DB connection URIs, ports, CORS origins

- Start services (example ports; adjust to your config):
  - Gateway: `npm run dev` in `api-gateway` (e.g., port 8080)
  - Auth Service: `npm start` in `user-service` (e.g., port 3001)
  - Booking Service: `npm start` in `booking-service` (e.g., port 3003)
  - Transport Service: `npm start` in `transport-service` (e.g., port 3002)
  - Accommodation Service: `npm start` in `accommodation-service` (e.g., port 3004)
  - Complaint Service: `npm start` in `complaint-service` (e.g., port 3005)
  - Web App: `npm run dev` in `wanderlanka-web-app`
  - Mobile App: `npx expo start` in `wanderlanka-mobile-app`

### Authentication
- Bearer access tokens are required for protected routes. The gateway enforces authentication for `/api/booking`, `/api/payment`, `/api/complaints`, and optional for `/api/transport`, `/api/accommodation`, `/api/guide`.
- Use `POST /api/auth/login` to obtain tokens and send `Authorization: Bearer <token>` in subsequent requests.

### Health and Observability
- Each service exposes `GET /health`.
- Gateway logs requests and maintains service health statuses.

### Notes and Future Extensions
- Payment, Itinerary, and Listing services are scaffolded in the gateway mapping and can be enabled by configuring their URLs.
- Role-based access control exists (e.g., complaints admin endpoints); ensure tokens carry roles.

### License
Proprietary/internal use unless otherwise specified.


