

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">WanderLanka Admin Control Center</h1>
            <p className="hero-subtitle">
              Comprehensive platform administration, user management, and system oversight with 
              advanced analytics and real-time monitoring capabilities.
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">System Monitoring</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Service Uptime</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview Cards */}
      <section className="overview-section">
        <div className="section-header">
          <h2 className="section-title">System Overview</h2>
          <p className="section-subtitle">Real-time insights and administrative control panels</p>
        </div>
        
        <div className="overview-grid">
          <div className="overview-card">
            <div className="card-icon card-icon--primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7.5C15 8.1 14.6 8.5 14 8.5S13 8.1 13 7.5V7L7 8.5V16.5L9.5 15.5V22H11V16L14.5 15L17 22H19L15.5 14.5L21 9Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">User Management</h3>
              <p className="card-description">
                Comprehensive user administration with role-based access control, 
                profile management, and activity monitoring across all platforms.
              </p>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon card-icon--success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                <path d="M2 17L12 22L22 17" fill="currentColor"/>
                <path d="M2 12L12 17L22 12" fill="currentColor"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Payment Analytics</h3>
              <p className="card-description">
                Advanced financial analytics with revenue tracking, transaction monitoring, 
                and comprehensive reporting tools for business intelligence.
              </p>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon card-icon--warning">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Signup Requests</h3>
              <p className="card-description">
                Streamlined approval workflow for new registrations with verification 
                processes, document review, and automated onboarding systems.
              </p>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon card-icon--info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" fill="currentColor"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Complaints Management</h3>
              <p className="card-description">
                Comprehensive complaint tracking and resolution system with priority 
                management, escalation workflows, and customer satisfaction metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Administrative Capabilities</h2>
          <p className="section-subtitle">Powerful tools designed for efficient platform administration</p>
        </div>

        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">Real-Time Monitoring</h3>
              <span className="feature-badge">Live Dashboard</span>
            </div>
            <p className="feature-description">
              Monitor system performance, user activity, and platform health with 
              real-time alerts and comprehensive status indicators.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">Revenue Analytics</h3>
              <span className="feature-badge">Advanced Reports</span>
            </div>
            <p className="feature-description">
              Detailed financial reporting with revenue streams analysis, payment 
              gateway monitoring, and profit margin calculations.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">User Verification</h3>
              <span className="feature-badge">Automated</span>
            </div>
            <p className="feature-description">
              Streamlined user verification process with document validation, 
              background checks, and compliance verification workflows.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">Support Ticketing</h3>
              <span className="feature-badge">Integrated</span>
            </div>
            <p className="feature-description">
              Advanced ticketing system with priority management, auto-assignment, 
              and comprehensive resolution tracking capabilities.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">Security Management</h3>
              <span className="feature-badge">Enterprise</span>
            </div>
            <p className="feature-description">
              Comprehensive security oversight with access control, audit logs, 
              threat detection, and compliance monitoring tools.
            </p>
          </div>

          <div className="feature-item">
            <div className="feature-header">
              <h3 className="feature-title">System Configuration</h3>
              <span className="feature-badge">Flexible</span>
            </div>
            <p className="feature-description">
              Advanced system configuration tools with feature toggles, environment 
              management, and deployment control capabilities.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-content">
          <div className="benefits-text">
            <h2 className="benefits-title">Why WanderLanka Admin Platform Excels</h2>
            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">
                  <strong>Increase operational efficiency</strong> by 40% through automated workflows and intelligent routing
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">
                  <strong>Enhance security posture</strong> with advanced threat detection and real-time monitoring
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">
                  <strong>Streamline user onboarding</strong> with automated verification and approval processes
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div className="benefit-text">
                  <strong>Optimize revenue streams</strong> with detailed analytics and performance insights
                </div>
              </div>
            </div>
          </div>
          <div className="benefits-visual">
            <div className="visual-card">
              <h4 className="visual-title">System Performance</h4>
              <div className="visual-metric">
                <span className="metric-value">99.9%</span>
                <span className="metric-label">Uptime</span>
              </div>
            </div>
            <div className="visual-card">
              <h4 className="visual-title">Response Time</h4>
              <div className="visual-metric">
                <span className="metric-value">&lt;100ms</span>
                <span className="metric-label">Average</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Tools Section */}
      <section className="support-section">
        <div className="support-content">
          <h2 className="support-title">Administrative Tools & Resources</h2>
          <p className="support-subtitle">
            Comprehensive administrative capabilities with enterprise-grade tools and support systems
          </p>
          
          <div className="support-grid">
            <div className="support-item">
              <h3 className="support-item-title">Advanced Analytics</h3>
              <p className="support-item-description">
                Deep dive into platform metrics with customizable dashboards, trend analysis, and predictive insights for data-driven decisions.
              </p>
            </div>
            <div className="support-item">
              <h3 className="support-item-title">Audit & Compliance</h3>
              <p className="support-item-description">
                Comprehensive audit trails, compliance reporting, and regulatory management tools to ensure platform integrity and legal compliance.
              </p>
            </div>
            <div className="support-item">
              <h3 className="support-item-title">API Management</h3>
              <p className="support-item-description">
                Complete API gateway management with rate limiting, authentication controls, and comprehensive monitoring for third-party integrations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;