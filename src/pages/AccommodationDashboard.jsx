import "../styles/TransportDashboard.css";

const AccommodationDashboard = () => {
  return (
    <div className="dashboard">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Accommodation Operations Center</h1>
            <p className="hero-subtitle">
              Streamline your property management, optimize bookings, and enhance guest experiences with WanderLanka's 
              comprehensive accommodation management platform.
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Guest Support</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Platform Uptime</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">750+</div>
              <div className="stat-label">Partner Properties</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview Cards */}
      <section className="overview-section">
        <div className="section-header">
          <h2 className="section-title">Business Overview</h2>
          <p className="section-subtitle">Real-time insights into your accommodation operations</p>
        </div>
        
        <div className="overview-grid">
          <div className="overview-card">
            <div className="card-icon card-icon--primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 7H16V6A4 4 0 0 0 8 6V7H5A1 1 0 0 0 4 8V19A3 3 0 0 0 7 22H17A3 3 0 0 0 20 19V8A1 1 0 0 0 19 7ZM10 6A2 2 0 0 1 14 6V7H10V6ZM18 19A1 1 0 0 1 17 20H7A1 1 0 0 1 6 19V9H8V10A1 1 0 0 0 10 10A1 1 0 0 0 10 10V9H14V10A1 1 0 0 0 16 10A1 1 0 0 0 14 10V9H18V19Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Property Management</h3>
              <p className="card-description">
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