import "./TransportDashboard.css";

const TransportDashboard = () => {
  return (
    <div className="dashboard">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Transport Operations Center</h1>
            <p className="hero-subtitle">
              Streamline your fleet operations, manage drivers, and optimize routes with WanderLanka's 
              comprehensive transport management platform.
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Operations Support</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">99.8%</div>
              <div className="stat-label">Platform Uptime</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Active Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview Cards */}
      <section className="overview-section">
        <div className="section-header">
          <h2 className="section-title">Business Overview</h2>
          <p className="section-subtitle">Real-time insights into your transport operations</p>
        </div>
        
        <div className="overview-grid">
          <div className="overview-card">
            <div className="card-icon card-icon--primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 17H7V10H9M13 17H11V7H13M17 17H15V13H17M19.5 19.1H4.5V5H19.5V19.1Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Fleet Performance</h3>
              <p className="card-description">
                Monitor vehicle utilization, maintenance schedules, and operational efficiency 
                across your entire fleet.
              </p>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon card-icon--success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Route Optimization</h3>
              <p className="card-description">
                Advanced algorithms help optimize routes, reduce fuel costs, and improve 
                delivery times for maximum efficiency.
              </p>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon card-icon--warning">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7.5C15 8.1 14.6 8.5 14 8.5S13 8.1 13 7.5V7L7 8.5V16.5L9.5 15.5V22H11V16L14.5 15L17 22H19L15.5 14.5L21 9Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Driver Management</h3>
              <p className="card-description">
                Comprehensive driver profiles, performance tracking, and compliance 
                management in one integrated system.
              </p>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon card-icon--info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 18C15.89 18 15 18.89 15 20C15 21.11 15.89 22 17 22C18.11 22 19 21.11 19 20C19 18.89 18.11 18 17 18ZM1 2V4H3L6.6 11.59L5.24 14.04C5.09 14.32 5 14.65 5 15C5 16.11 5.89 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.58 17.3 11.97L20.88 5H5.21L4.27 3H1ZM7 18C5.89 18 5 18.89 5 20C5 21.11 5.89 22 7 22C8.11 22 9 21.11 9 20C9 18.89 8.11 18 7 18Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Booking Management</h3>
              <p className="card-description">
                Streamlined booking system with real-time availability, automated 
                confirmations, and customer communication tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Platform Capabilities</h2>
          <p className="section-subtitle">Comprehensive tools designed for modern transport businesses</p>
        </div>

        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">Real-Time Tracking</h3>
              <span className="feature-badge">Live GPS</span>
            </div>
            <p className="feature-description">
              Monitor all vehicles in real-time with GPS tracking, route history, and 
              live location sharing with customers.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">Financial Analytics</h3>
              <span className="feature-badge">Advanced Reports</span>
            </div>
            <p className="feature-description">
              Comprehensive financial reporting with revenue tracking, expense management, 
              and profitability analysis.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">Maintenance Scheduling</h3>
              <span className="feature-badge">Automated</span>
            </div>
            <p className="feature-description">
              Proactive maintenance scheduling based on mileage, time intervals, and 
              vehicle condition monitoring.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">Customer Portal</h3>
              <span className="feature-badge">Self-Service</span>
            </div>
            <p className="feature-description">
              Dedicated customer portal for bookings, trip history, invoice management, 
              and direct communication.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">Compliance Management</h3>
              <span className="feature-badge">Regulatory</span>
            </div>
            <p className="feature-description">
              Stay compliant with local regulations, license renewals, insurance tracking, 
              and documentation management.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">Mobile Application</h3>
              <span className="feature-badge">Cross-Platform</span>
            </div>
            <p className="feature-description">
              Native mobile apps for drivers and administrators with offline capabilities 
              and real-time synchronization.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-content">
          <div className="benefits-text">
            <h2 className="benefits-title">Why Choose WanderLanka Transport Solutions</h2>
            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">
                  <strong>Reduce operational costs</strong> by up to 30% through optimized routing and fuel management
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">
                  <strong>Improve customer satisfaction</strong> with real-time tracking and communication
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">
                  <strong>Ensure regulatory compliance</strong> with automated documentation and renewals
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">
                  <strong>Scale your business</strong> with cloud-based infrastructure and unlimited capacity
                </div>
              </div>
            </div>
          </div>
          <div className="benefits-visual">
            <div className="visual-card">
              <h4 className="visual-title">Platform Reliability</h4>
              <div className="visual-metric">
                <span className="metric-value">99.8%</span>
                <span className="metric-label">Uptime</span>
              </div>
            </div>
            <div className="visual-card">
              <h4 className="visual-title">Customer Satisfaction</h4>
              <div className="visual-metric">
                <span className="metric-value">4.9/5</span>
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
            Get the most out of your transport management system with our comprehensive support services
          </p>
          
          <div className="support-grid">
            <div className="support-item">
              <h3 className="support-item-title">24/7 Technical Support</h3>
              <p className="support-item-description">
                Round-the-clock technical assistance with dedicated support engineers and priority response times.
              </p>
            </div>
            <div className="support-item">
              <h3 className="support-item-title">Training & Onboarding</h3>
              <p className="support-item-description">
                Comprehensive training programs for your team with certification and ongoing education resources.
              </p>
            </div>
            <div className="support-item">
              <h3 className="support-item-title">API Documentation</h3>
              <p className="support-item-description">
                Complete API documentation and integration guides for custom implementations and third-party systems.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TransportDashboard;