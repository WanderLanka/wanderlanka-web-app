import React, { useState } from 'react';
import { messagesAPI } from '../../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [toUserId, setToUserId] = useState('');
  const [subject, setSubject] = useState('Account Notice');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [resultMsg, setResultMsg] = useState('');

  const handleSend = async () => {
    try {
      setSending(true);
      setResultMsg('');
      await messagesAPI.sendToUser({ toUserId, subject, body, reason: 'ACCOUNT_RESTRICTION' });
      setResultMsg('Message sent');
      setBody('');
    } catch (e) {
      setResultMsg('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 relative py-20 overflow-hidden">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-transparent to-indigo-500/10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.618fr,1fr] gap-16 items-center relative z-10">
          <div className="text-white">
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent tracking-tight">
              WanderLanka Admin Control Center
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-xl">
              Comprehensive platform administration, user management, and system oversight with advanced analytics and real-time monitoring capabilities.
            </p>
          </div>
          
          <div className="grid gap-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 hover:border-blue-500/30 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="text-4xl font-extrabold text-blue-200 mb-2 leading-none">24/7</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">System Monitoring</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 hover:border-blue-500/30 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="text-4xl font-extrabold text-blue-200 mb-2 leading-none">99.9%</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Service Uptime</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 hover:border-blue-500/30 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="text-4xl font-extrabold text-blue-200 mb-2 leading-none">10K+</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* System Overview Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">System Overview</h2>
          <p className="text-xl text-slate-600">Real-time insights and administrative control panels</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-150">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7.5C15 8.1 14.6 8.5 14 8.5S13 8.1 13 7.5V7L7 8.5V16.5L9.5 15.5V22H11V16L14.5 15L17 22H19L15.5 14.5L21 9Z" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">User Management</h3>
            <p className="text-slate-600 text-sm">
              Comprehensive user administration with role-based access control and activity monitoring.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-green-200 transition-all duration-150">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-600">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                <path d="M2 17L12 22L22 17" fill="currentColor"/>
                <path d="M2 12L12 17L22 12" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Payment Analytics</h3>
            <p className="text-slate-600 text-sm">
              Advanced financial analytics with revenue tracking and transaction monitoring.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-amber-200 transition-all duration-150">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-amber-600">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Signup Requests</h3>
            <p className="text-slate-600 text-sm">
              Streamlined approval workflow for new registrations with verification processes.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-indigo-200 transition-all duration-150">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600">
                <path d="M20 6L9 17L4 12" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Complaints Management</h3>
            <p className="text-slate-600 text-sm">
              Comprehensive complaint tracking with priority management and escalation workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Administrative Capabilities */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Administrative Capabilities</h2>
          <p className="text-xl text-slate-600">Powerful tools designed for efficient platform administration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Real-Time Monitoring', badge: 'Live Dashboard', desc: 'Monitor system performance, user activity, and platform health with real-time alerts.' },
            { title: 'Revenue Analytics', badge: 'Advanced Reports', desc: 'Detailed financial reporting with revenue streams analysis and profit calculations.' },
            { title: 'User Verification', badge: 'Automated', desc: 'Streamlined user verification with document validation and compliance workflows.' },
            { title: 'Support Ticketing', badge: 'Integrated', desc: 'Advanced ticketing system with priority management and auto-assignment.' },
            { title: 'Security Management', badge: 'Enterprise', desc: 'Comprehensive security oversight with access control and threat detection.' },
            { title: 'System Configuration', badge: 'Flexible', desc: 'Advanced configuration tools with feature toggles and deployment control.' },
          ].map((feature, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-150">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">{feature.badge}</span>
              </div>
              <p className="text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-8">
                Why WanderLanka Admin Platform Excels
              </h2>
              <div className="space-y-6">
                {[
                  { title: 'Increase operational efficiency', desc: 'by 40% through automated workflows and intelligent routing' },
                  { title: 'Enhance security posture', desc: 'with advanced threat detection and real-time monitoring' },
                  { title: 'Streamline user onboarding', desc: 'with automated verification and approval processes' },
                  { title: 'Optimize revenue streams', desc: 'with detailed analytics and performance insights' },
                ].map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <div>
                      <p className="text-slate-900"><strong>{benefit.title}</strong> {benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center hover:shadow-lg transition-shadow duration-150">
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">System Performance</h4>
                <div className="text-5xl font-extrabold text-blue-600 mb-2">99.9%</div>
                <p className="text-slate-600">Uptime</p>
              </div>
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center hover:shadow-lg transition-shadow duration-150">
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">Response Time</h4>
                <div className="text-5xl font-extrabold text-indigo-600 mb-2">&lt;100ms</div>
                <p className="text-slate-600">Average</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Administrative Tools & Resources */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Administrative Tools & Resources</h2>
          <p className="text-xl text-slate-600">Comprehensive administrative capabilities with enterprise-grade tools and support systems</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Advanced Analytics', desc: 'Deep dive into platform metrics with customizable dashboards, trend analysis, and predictive insights for data-driven decisions.' },
            { title: 'Audit & Compliance', desc: 'Comprehensive audit trails, compliance reporting, and regulatory management tools to ensure platform integrity and legal compliance.' },
            { title: 'API Management', desc: 'Complete API gateway management with rate limiting, authentication controls, and comprehensive monitoring for third-party integrations.' },
          ].map((tool, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 hover:shadow-md hover:border-blue-200 transition-all duration-150">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">{tool.title}</h3>
              <p className="text-slate-600">{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* README Link */}
      <footer className="max-w-7xl mx-auto px-6 pb-10">
        <div className="border-t border-slate-200 pt-6 text-center">
          <a
            href="/README.md"
            target="_blank"
            rel="noreferrer"
            className="text-slate-500 hover:text-slate-700 underline"
          >
            View project README (architecture, APIs)
          </a>
        </div>
      </footer>

      {/* Floating Message Button */}
      <button
        onClick={() => setIsComposerOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl transform transition-all duration-200 hover:-translate-y-1 hover:scale-105 border border-white/20"
        style={{ width: '56px', height: '56px' }}
        aria-label="Open admin message composer"
      >
        {/* Message icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-auto">
          <path d="M4 5h16v10H7l-3 3V5z" fill="currentColor" opacity="0.9"/>
        </svg>
      </button>

      {isComposerOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-3 flex items-center justify-between">
            <div className="font-semibold">Admin Message</div>
            <button onClick={() => setIsComposerOpen(false)} className="text-slate-300 hover:text-white">✕</button>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">To User ID</label>
              <input value={toUserId} onChange={(e) => setToUserId(e.target.value)} placeholder="Mongo ObjectId" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type your message to the user..." />
            </div>
            {resultMsg && <div className="text-sm text-slate-600">{resultMsg}</div>}
          </div>
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <button onClick={() => setIsComposerOpen(false)} className="px-4 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-100">Cancel</button>
            <button onClick={handleSend} disabled={sending || !toUserId || !body} className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50">{sending ? 'Sending...' : 'Send'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;