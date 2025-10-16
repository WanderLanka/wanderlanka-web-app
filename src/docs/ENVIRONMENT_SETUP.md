# Environment Setup

## Quick Start

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env.development
   ```

2. **Update the API URL if needed:**
   Open `.env.development` and modify:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Environment Files

- **`.env.example`** - Template file (committed to git)
- **`.env.development`** - Development settings (gitignored)
- **`.env.production`** - Production settings (gitignored)
- **`.env.local`** - Local overrides (gitignored)

## Important Notes

⚠️ **Never commit actual .env files to version control**
✅ **Always use .env.example as a template**
🔒 **Keep sensitive data out of .env.example**

## Available Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | API Gateway URL | `http://localhost:3000/api` |
| `VITE_NODE_ENV` | Environment mode | `development` |

For more environment variables, see `.env.example`.
