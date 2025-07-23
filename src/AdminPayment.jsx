import React, { useState, useEffect } from "react";
import "./AdminPayment.css";

const AdminPayment = () => {
  // State management
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter states
  const [filterType, setFilterType] = useState("all"); // all, received, sent
  const [filterProvider, setFilterProvider] = useState("all"); // all, accommodation, transport, guide
  const [filterStatus, setFilterStatus] = useState("all"); // all, completed, pending, failed
  const [filterDate, setFilterDate] = useState("all"); // all, today, week, month
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock payment data - replace with actual API call
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

  // Simulate API call
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        // Simulate API delay
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

  // Filter payments
  useEffect(() => {
    let filtered = [...payments];

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(payment => payment.type === filterType);
    }

    // Filter by provider
    if (filterProvider !== "all") {
      filtered = filtered.filter(payment => payment.provider === filterProvider);
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(payment => payment.status === filterStatus);
    }

    // Filter by date
    if (filterDate !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.date);
        
        switch (filterDate) {
          case "today":
            return paymentDate >= today;
          case "week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return paymentDate >= weekAgo;
          case "month":
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return paymentDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredPayments(filtered);
    setCurrentPage(1);
  }, [payments, filterType, filterProvider, filterStatus, filterDate]);

  // Calculate statistics
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

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  // Helper functions
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

  const getStatusBadge = (status) => {
    const badges = {
      completed: "status-badge status-badge--success",
      pending: "status-badge status-badge--warning",
      failed: "status-badge status-badge--error"
    };
    return badges[status] || "status-badge";
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
      <div className="payment-analytics">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading payment analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-analytics">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Payment Analytics</h1>
            <p className="page-subtitle">
              Comprehensive payment tracking and financial insights across all platform transactions
            </p>
          </div>
          
          <div className="header-stats">
            <div className="stats-grid">
              <div className="stat-item stat-item--success">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <div className="stat-number">{formatCurrency(stats.totalReceived)}</div>
                  <div className="stat-label">Total Received</div>
                </div>
              </div>
              <div className="stat-item stat-item--primary">
                <div className="stat-icon">💸</div>
                <div className="stat-content">
                  <div className="stat-number">{formatCurrency(stats.totalSent)}</div>
                  <div className="stat-label">Total Sent</div>
                </div>
              </div>
              <div className="stat-item stat-item--warning">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.pendingPayments}</div>
                  <div className="stat-label">Pending</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="filters-group">
            <div className="filter-item">
              <label className="filter-label">Payment Type:</label>
              <select 
                className="filter-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Payments</option>
                <option value="received">Payments Received</option>
                <option value="sent">Payments Sent</option>
              </select>
            </div>

            <div className="filter-item">
              <label className="filter-label">Provider Type:</label>
              <select 
                className="filter-select"
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

            <div className="filter-item">
              <label className="filter-label">Status:</label>
              <select 
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="filter-item">
              <label className="filter-label">Date Range:</label>
              <select 
                className="filter-select"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>

          <div className="results-info">
            <span className="results-count">
              {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Payments Table */}
      <div className="payments-section">
        {currentPayments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <h3 className="empty-title">No Payments Found</h3>
            <p className="empty-description">
              No payment records match your current filter criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="payments-table-container">
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Parties</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Method</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPayments.map((payment) => (
                    <tr key={payment.id} className="payment-row">
                      <td className="transaction-cell">
                        <div className="transaction-info">
                          <div className="transaction-id">{payment.id}</div>
                          <div className="transaction-ref">{payment.transactionId}</div>
                        </div>
                      </td>
                      
                      <td className="type-cell">
                        <div className="payment-type">
                          <span className="type-icon">{getTypeIcon(payment.type)}</span>
                          <span className={`type-text type-text--${payment.type}`}>
                            {payment.type === "received" ? "Received" : "Sent"}
                          </span>
                        </div>
                      </td>
                      
                      <td className="amount-cell">
                        <div className={`amount amount--${payment.type}`}>
                          {formatCurrency(payment.amount)}
                        </div>
                      </td>
                      
                      <td className="parties-cell">
                        <div className="parties-info">
                          <div className="party-item">
                            <span className="party-label">From:</span>
                            <span className="party-name">{payment.from}</span>
                          </div>
                          <div className="party-item">
                            <span className="party-label">To:</span>
                            <span className="party-name">{payment.to}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="service-cell">
                        <div className="service-info">
                          <span className="service-icon">{getProviderIcon(payment.provider)}</span>
                          <div className="service-details">
                            <div className="service-name">{payment.service}</div>
                            <div className="service-reference">{payment.reference}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="status-cell">
                        <span className={getStatusBadge(payment.status)}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      
                      <td className="date-cell">
                        <div className="date-info">
                          {formatDate(payment.date)}
                        </div>
                      </td>
                      
                      <td className="method-cell">
                        <div className="payment-method">
                          {payment.paymentMethod}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                
                <div className="pagination-info">
                  <span className="page-numbers">
                    Page {currentPage} of {totalPages}
                  </span>
                  <span className="items-info">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPayments.length)} of {filteredPayments.length}
                  </span>
                </div>
                
                <button 
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPayment;