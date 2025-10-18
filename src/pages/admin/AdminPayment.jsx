import React, { useState, useEffect } from "react";

const AdminPayment = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [filterType, setFilterType] = useState("all");
  const [filterProvider, setFilterProvider] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const mockPayments = [
    {
      id: "PAY-001",
      type: "received",
      amount: 25000.00,
      currency: "LKR",
      from: "John Doe",
      to: "WanderLanka System",
      provider: "user",
      service: "Hotel Booking",
      status: "completed",
      date: "2025-01-20T10:30:00Z",
      transactionId: "TXN-2025-001",
      paymentMethod: "Credit Card",
      reference: "Hotel Cinnamon Grand - Room 205"
    },
    {
      id: "PAY-002",
      type: "sent",
      amount: 18750.00,
      currency: "LKR",
      from: "WanderLanka System",
      to: "Cinnamon Hotels",
      provider: "accommodation",
      service: "Commission Payment",
      status: "completed",
      date: "2025-01-20T11:45:00Z",
      transactionId: "TXN-2025-002",
      paymentMethod: "Bank Transfer",
      reference: "Commission for booking PAY-001"
    },
    {
      id: "PAY-003",
      type: "received",
      amount: 12000.00,
      currency: "LKR",
      from: "Sarah Wilson",
      to: "WanderLanka System",
      provider: "user",
      service: "Transport Booking",
      status: "completed",
      date: "2025-01-19T14:20:00Z",
      transactionId: "TXN-2025-003",
      paymentMethod: "Digital Wallet",
      reference: "Airport Transfer Service"
    },
    {
      id: "PAY-004",
      type: "sent",
      amount: 9000.00,
      currency: "LKR",
      from: "WanderLanka System",
      to: "ABC Transport Services",
      provider: "transport",
      service: "Service Payment",
      status: "pending",
      date: "2025-01-19T15:30:00Z",
      transactionId: "TXN-2025-004",
      paymentMethod: "Bank Transfer",
      reference: "Payment for transport service PAY-003"
    },
    {
      id: "PAY-005",
      type: "received",
      amount: 8500.00,
      currency: "LKR",
      from: "Mike Johnson",
      to: "WanderLanka System",
      provider: "user",
      service: "Guide Booking",
      status: "completed",
      date: "2025-01-18T09:15:00Z",
      transactionId: "TXN-2025-005",
      paymentMethod: "Credit Card",
      reference: "City Tour Guide Service"
    },
    {
      id: "PAY-006",
      type: "sent",
      amount: 6375.00,
      currency: "LKR",
      from: "WanderLanka System",
      to: "Expert Tour Guides",
      provider: "guide",
      service: "Guide Payment",
      status: "completed",
      date: "2025-01-18T16:45:00Z",
      transactionId: "TXN-2025-006",
      paymentMethod: "Digital Payment",
      reference: "Payment for guide service PAY-005"
    }
  ];

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPayments(mockPayments);
        setFilteredPayments(mockPayments);
        setError("");
      } catch (err) {
        setError("Failed to fetch payment data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    let filtered = [...payments];

    if (filterType !== "all") {
      filtered = filtered.filter(payment => payment.type === filterType);
    }
    if (filterProvider !== "all") {
      filtered = filtered.filter(payment => payment.provider === filterProvider);
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter(payment => payment.status === filterStatus);
    }
    if (filterDate !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.date);
        switch (filterDate) {
          case "today":
            return paymentDate >= today;
          case "week":
            return paymentDate >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          case "month":
            return paymentDate >= new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          default:
            return true;
        }
      });
    }

    setFilteredPayments(filtered);
    setCurrentPage(1);
  }, [payments, filterType, filterProvider, filterStatus, filterDate]);

  const stats = {
    totalPayments: filteredPayments.length,
    totalReceived: filteredPayments
      .filter(p => p.type === "received" && p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0),
    totalSent: filteredPayments
      .filter(p => p.type === "sent" && p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: filteredPayments.filter(p => p.status === "pending").length
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-green-100 text-green-700",
      pending: "bg-amber-100 text-amber-700",
      failed: "bg-red-100 text-red-700"
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getTypeIcon = (type) => {
    return type === "received" ? "📈" : "📉";
  };

  const getProviderIcon = (provider) => {
    const icons = {
      accommodation: "🏨",
      transport: "🚗",
      guide: "👨‍🏫",
      user: "👤"
    };
    return icons[provider] || "💼";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading payment analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-transparent to-indigo-500/10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent tracking-tight">
              Payment Analytics
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
              Comprehensive payment tracking and financial insights across all platform transactions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-green-500/30 transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Total Received</div>
              <div className="text-3xl font-extrabold text-green-200">{formatCurrency(stats.totalReceived)}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-blue-500/30 transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Total Sent</div>
              <div className="text-3xl font-extrabold text-blue-200">{formatCurrency(stats.totalSent)}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-amber-500/30 transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Pending Payments</div>
              <div className="text-3xl font-extrabold text-amber-200">{stats.pendingPayments}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Payment Type</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Payments</option>
                <option value="received">Payments Received</option>
                <option value="sent">Payments Sent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Provider Type</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterProvider}
                onChange={(e) => setFilterProvider(e.target.value)}
              >
                <option value="all">All Providers</option>
                <option value="user">Users</option>
                <option value="accommodation">Hotels</option>
                <option value="transport">Transport</option>
                <option value="guide">Guides</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Status</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Date Range</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{filteredPayments.length}</span> payment{filteredPayments.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        {currentPayments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="text-5xl mb-4">💳</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Payments Found</h3>
            <p className="text-slate-600">No payment records match your current filter criteria.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Transaction</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">From / To</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Service</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-mono text-blue-600">{payment.id}</div>
                          <div className="text-xs text-slate-500">{payment.transactionId}</div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <span className="mr-2">{getTypeIcon(payment.type)}</span>
                            <span className={payment.type === "received" ? "text-green-700 font-semibold" : "text-blue-700 font-semibold"}>
                              {payment.type === "received" ? "Received" : "Sent"}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className={`text-sm font-semibold ${payment.type === "received" ? "text-green-700" : "text-blue-700"}`}>
                            {formatCurrency(payment.amount)}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 text-sm">
                          <div className="text-slate-900 font-medium">From: {payment.from}</div>
                          <div className="text-slate-600">To: {payment.to}</div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <span className="mr-2">{getProviderIcon(payment.provider)}</span>
                            <span className="font-medium text-slate-900">{payment.service}</span>
                          </div>
                          <div className="text-xs text-slate-500">{payment.reference}</div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(payment.date)}
                        </td>
                        
                        <td className="px-6 py-4 text-sm text-slate-900">
                          {payment.paymentMethod}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <button 
                  className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold">Page {currentPage}</span> of {totalPages} | Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredPayments.length)} of {filteredPayments.length}
                </div>
                <button 
                  className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default AdminPayment;