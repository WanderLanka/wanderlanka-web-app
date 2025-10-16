// import "../styles/TransportDashboard.css"; // Converted to Tailwind CSS

const TransportDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 relative py-20 overflow-hidden">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-transparent to-blue-500/10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.618fr,1fr] gap-16 items-center relative z-10">
          <div className="text-white">
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent tracking-tight">
              Transport Operations Center
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-xl">
              Streamline your fleet operations, manage drivers, and optimize routes with WanderLanka's 
              comprehensive transport management platform.
            </p>
          </div>
          
          <div className="grid gap-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 hover:border-emerald-500/30 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="text-4xl font-extrabold text-emerald-200 mb-2 leading-none">24/7</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Operations Support</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 hover:border-emerald-500/30 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="text-4xl font-extrabold text-emerald-200 mb-2 leading-none">99.8%</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Platform Uptime</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 hover:border-emerald-500/30 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="text-4xl font-extrabold text-emerald-200 mb-2 leading-none">500+</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Active Partners</div>
            </div>
          </div>
        </div>
      </section>
        
      {/* Overview Cards Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Business Overview</h2>
          <p className="text-xl text-slate-600">Real-time insights into your transport operations</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-150">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                <path d="M9 17H7V10H9M13 17H11V7H13M17 17H15V13H17M19.5 19.1H4.5V5H19.5V19.1Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">Fleet Performance</h3>
              <p className="text-slate-600">
                Monitor vehicle utilization, maintenance schedules, and operational efficiency 
                across your entire fleet.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-150">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">Route Optimization</h3>
              <p className="text-slate-600">
                Advanced algorithms help optimize routes, reduce fuel costs, and improve 
                delivery times for maximum efficiency.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-150">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-amber-600">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7.5C15 8.1 14.6 8.5 14 8.5S13 8.1 13 7.5V7L7 8.5V16.5L9.5 15.5V22H11V16L14.5 15L17 22H19L15.5 14.5L21 9Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">Driver Management</h3>
              <p className="text-slate-600">
                Comprehensive driver profiles, performance tracking, and compliance 
                management in one integrated system.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-150">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                <path d="M17 18C15.89 18 15 18.89 15 20C15 21.11 15.89 22 17 22C18.11 22 19 21.11 19 20C19 18.89 18.11 18 17 18ZM1 2V4H3L6.6 11.59L5.24 14.04C5.09 14.32 5 14.65 5 15C5 16.11 5.89 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.58 17.3 11.97L20.88 5H5.21L4.27 3H1ZM7 18C5.89 18 5 18.89 5 20C5 21.11 5.89 22 7 22C8.11 22 9 21.11 9 20C9 18.89 8.11 18 7 18Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">Booking Management</h3>
              <p className="text-slate-600">
                Streamlined booking system with real-time availability, automated 
                confirmations, and customer communication tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Platform Capabilities</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">Comprehensive tools designed for modern transport businesses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors duration-150">Real-Time Tracking</h3>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Live GPS</span>
              </div>
              <p className="text-slate-600">
                Monitor all vehicles in real-time with GPS tracking, route history, and 
                live location sharing with customers.
              </p>
            </div>

            <div className="group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors duration-150">Financial Analytics</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Advanced Reports</span>
              </div>
              <p className="text-slate-600">
                Comprehensive financial reporting with revenue tracking, expense management, 
                and profitability analysis.
              </p>
            </div>

            <div className="group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors duration-150">Maintenance Scheduling</h3>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Automated</span>
              </div>
              <p className="text-slate-600">
                Proactive maintenance scheduling based on mileage, time intervals, and 
                vehicle condition monitoring.
              </p>
            </div>

            <div className="group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors duration-150">Customer Portal</h3>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Self-Service</span>
              </div>
              <p className="text-slate-600">
                Dedicated customer portal for bookings, trip history, invoice management, 
                and direct communication.
              </p>
            </div>
            
            <div className="group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors duration-150">Compliance Management</h3>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Regulatory</span>
              </div>
              <p className="text-slate-600">
                Stay compliant with local regulations, license renewals, insurance tracking, 
                and documentation management.
              </p>
            </div>

            <div className="group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors duration-150">Mobile Application</h3>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">Cross-Platform</span>
              </div>
              <p className="text-slate-600">
                Native mobile apps for drivers and administrators with offline capabilities 
                and real-time synchronization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Why Choose WanderLanka Transport Solutions</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                  </div>
                  <div className="text-slate-700">
                    <strong className="text-slate-900">Reduce operational costs</strong> by up to 30% through optimized routing and fuel management
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                  </div>
                  <div className="text-slate-700">
                    <strong className="text-slate-900">Improve customer satisfaction</strong> with real-time tracking and communication
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                  </div>
                  <div className="text-slate-700">
                    <strong className="text-slate-900">Ensure regulatory compliance</strong> with automated documentation and renewals
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                  </div>
                  <div className="text-slate-700">
                    <strong className="text-slate-900">Scale your business</strong> with cloud-based infrastructure and unlimited capacity
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Platform Reliability</h4>
                <div className="text-center">
                  <span className="block text-3xl font-bold text-emerald-600">99.8%</span>
                  <span className="text-sm text-slate-500 uppercase tracking-wider">Uptime</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Customer Satisfaction</h4>
                <div className="text-center">
                  <span className="block text-3xl font-bold text-emerald-600">4.9/5</span>
                  <span className="text-sm text-slate-500 uppercase tracking-wider">Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Enterprise Support & Resources</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get the most out of your transport management system with our comprehensive support services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">24/7 Technical Support</h3>
              <p className="text-slate-600">
                Round-the-clock technical assistance with dedicated support engineers and priority response times.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Training & Onboarding</h3>
              <p className="text-slate-600">
                Comprehensive training programs for your team with certification and ongoing education resources.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">API Documentation</h3>
              <p className="text-slate-600">
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