// import "../styles/TransportDashboard.css"; // Converted to Tailwind CSS
import "../../styles/AccomodationDashboard.css";

const AccommodationDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 relative py-20 overflow-hidden">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-transparent to-indigo-500/10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.618fr,1fr] gap-16 items-center relative z-10">
          <div className="text-white">
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent tracking-tight">
              Accommodation Operations Center
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-xl">
              Streamline your property management, optimize bookings, and enhance guest experiences with WanderLanka's 
              comprehensive accommodation management platform.
            </p>
          </div>
          
          <div className="grid gap-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 hover:border-blue-500/30 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="text-4xl font-extrabold text-blue-200 mb-2 leading-none">24/7</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Guest Support</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 hover:border-blue-500/30 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="text-4xl font-extrabold text-blue-200 mb-2 leading-none">99.9%</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Platform Uptime</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 hover:border-blue-500/30 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="text-4xl font-extrabold text-blue-200 mb-2 leading-none">750+</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Partner Properties</div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Cards Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Business Overview</h2>
          <p className="text-xl text-slate-600">Real-time insights into your accommodation operations</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-150">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                <path d="M19 7H16V6A4 4 0 0 0 8 6V7H5A1 1 0 0 0 4 8V19A3 3 0 0 0 7 22H17A3 3 0 0 0 20 19V8A1 1 0 0 0 19 7ZM10 6A2 2 0 0 1 14 6V7H10V6ZM18 19A1 1 0 0 1 17 20H7A1 1 0 0 1 6 19V9H8V10A1 1 0 0 0 10 10A1 1 0 0 0 10 10V9H14V10A1 1 0 0 0 16 10A1 1 0 0 0 14 10V9H18V19Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">Property Management</h3>
              <p className="text-slate-600">
                Manage room inventory, pricing strategies, and property amenities 
                with intelligent automation and real-time updates.
              </p>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon card-icon--success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 11H7V9H9M13 11H11V9H13M17 11H15V9H17M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Booking Optimization</h3>
              <p className="card-description">
                Smart booking algorithms maximize occupancy rates, optimize pricing, 
                and reduce gaps between reservations.
              </p>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon card-icon--warning">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Guest Experience</h3>
              <p className="card-description">
                Enhance guest satisfaction with personalized services, seamless check-in/out, 
                and proactive communication systems.
              </p>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon card-icon--info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7.5C15 8.1 14.6 8.5 14 8.5S13 8.1 13 7.5V7L7 8.5V16.5L9.5 15.5V22H11V16L14.5 15L17 22H19L15.5 14.5L21 9Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Staff Management</h3>
              <p className="card-description">
                Streamlined staff scheduling, task management, and performance tracking 
                to ensure exceptional service delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Platform Capabilities</h2>
          <p className="section-subtitle">Comprehensive tools designed for modern accommodation businesses</p>
        </div>

        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">Revenue Management</h3>
              <span className="feature-badge">Dynamic Pricing</span>
            </div>
            <p className="feature-description">
              Intelligent pricing algorithms adjust rates based on demand, seasonality, 
              and competitor analysis to maximize revenue.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">Channel Management</h3>
              <span className="feature-badge">Multi-Platform</span>
            </div>
            <p className="feature-description">
              Seamlessly manage listings across booking platforms with synchronized 
              availability and real-time rate updates.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">Guest Communication</h3>
              <span className="feature-badge">Automated</span>
            </div>
            <p className="feature-description">
              Automated messaging system for booking confirmations, pre-arrival instructions, 
              and post-stay follow-ups.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">Housekeeping Management</h3>
              <span className="feature-badge">Smart Scheduling</span>
            </div>
            <p className="feature-description">
              Optimize cleaning schedules, track room status, and manage maintenance 
              requests with real-time updates.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">Analytics Dashboard</h3>
              <span className="feature-badge">Business Intelligence</span>
            </div>
            <p className="feature-description">
              Comprehensive analytics with occupancy trends, revenue forecasting, 
              and guest satisfaction metrics.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">Mobile Access</h3>
              <span className="feature-badge">Cross-Platform</span>
            </div>
            <p className="feature-description">
              Full-featured mobile application for property managers and staff 
              with offline capabilities and instant notifications.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-content">
          <div className="benefits-text">
            <h2 className="benefits-title">Why Choose WanderLanka Accommodation Solutions</h2>
            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">
                  <strong>Increase revenue</strong> by up to 25% through dynamic pricing and occupancy optimization
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">
                  <strong>Enhance guest satisfaction</strong> with personalized experiences and seamless service
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">
                  <strong>Reduce operational overhead</strong> with automated workflows and smart scheduling
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">
                  <strong>Expand your reach</strong> with multi-channel distribution and global booking platforms
                </div>
              </div>
            </div>
          </div>
          <div className="benefits-visual">
            <div className="visual-card">
              <h4 className="visual-title">Platform Reliability</h4>
              <div className="visual-metric">
                <span className="metric-value">99.9%</span>
                <span className="metric-label">Uptime</span>
              </div>
            </div>
            <div className="visual-card">
              <h4 className="visual-title">Guest Satisfaction</h4>
              <div className="visual-metric">
                <span className="metric-value">4.8/5</span>
                <span className="metric-label">Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="support-section">
        <div className="support-content">
          <h2 className="support-title">Enterprise Support & Resources</h2>
          <p className="support-subtitle">
            Get the most out of your accommodation management system with our comprehensive support services
          </p>
          
          <div className="support-grid">
            <div className="support-item">
              <h3 className="support-item-title">24/7 Property Support</h3>
              <p className="support-item-description">
                Round-the-clock assistance for property managers with dedicated hospitality experts and emergency response.
              </p>
            </div>
            <div className="support-item">
              <h3 className="support-item-title">Hospitality Training</h3>
              <p className="support-item-description">
                Specialized training programs for hospitality staff with industry best practices and service excellence.
              </p>
            </div>
            <div className="support-item">
              <h3 className="support-item-title">Integration Support</h3>
              <p className="support-item-description">
                Seamless integration with PMS, channel managers, and booking platforms with technical assistance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccommodationDashboard;