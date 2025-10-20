import { useState, useEffect, useCallback, useMemo } from "react";
// import api from "../../services/axiosConfig"; // You'll uncomment this when using real API

const AccommodationPayments = () => {
  const [payments, setPayments] = useState([]);
  const [errors, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [hotels, setHotels] = useState([]); // Now stores only hotel names
  const [filterHotel, setFilterHotel] = useState("all"); // New hotel filter state

  // Dummy data - only successful payments
  const dummyPayments = useMemo(() => [
    {
      _id: "payment001",
      bookingId: "booking123",
      user: "John Doe",
      userEmail: "john.doe@email.com",
      userPhone: "+94771234567",
      amount: 25000,
      paymentMethod: "credit_card",
      status: "completed",
      date: "2025-07-20T14:30:00Z",
      transactionId: "TXN789456123",
      hotel: { 
        name: "Grand Hotel Colombo", 
        location: "Colombo", 
        accommodationType: "hotel",
        address: "123 Galle Road, Colombo 03",
        phone: "+94112345678"
      },
      room: { type: "deluxe", number: "205" },
      description: "Hotel booking payment",
      currency: "LKR",
      checkIn: "2025-07-25T15:00:00Z",
      checkOut: "2025-07-28T11:00:00Z",
      nights: 3
    },
    {
      _id: "payment002",
      bookingId: "booking124",
      user: "Jane Smith",
      userEmail: "jane.smith@email.com",
      userPhone: "+94771234568",
      amount: 18500,
      paymentMethod: "paypal",
      status: "completed",
      date: "2025-07-21T09:15:00Z",
      transactionId: "TXN789456124",
      hotel: { 
        name: "Beach Resort Negombo", 
        location: "Negombo", 
        accommodationType: "resort",
        address: "45 Beach Road, Negombo",
        phone: "+94312234567"
      },
      room: { type: "standard", number: "102" },
      description: "Resort booking payment",
      currency: "LKR",
      checkIn: "2025-07-26T15:00:00Z",
      checkOut: "2025-07-29T11:00:00Z",
      nights: 3
    },
    {
      _id: "payment003",
      bookingId: "booking125",
      user: "Mike Johnson",
      userEmail: "mike.johnson@email.com",
      userPhone: "+94771234569",
      amount: 42000,
      paymentMethod: "bank_transfer",
      status: "completed",
      date: "2025-07-19T16:45:00Z",
      transactionId: "TXN789456125",
      hotel: { 
        name: "Mountain View Lodge", 
        location: "Kandy", 
        accommodationType: "lodge",
        address: "78 Hill Street, Kandy",
        phone: "+94812345678"
      },
      room: { type: "suite", number: "301" },
      description: "Lodge booking payment",
      currency: "LKR",
      checkIn: "2025-07-24T15:00:00Z",
      checkOut: "2025-07-27T11:00:00Z",
      nights: 3
    },
    {
      _id: "payment004",
      bookingId: "booking126",
      user: "Sarah Wilson",
      userEmail: "sarah.wilson@email.com",
      userPhone: "+94771234570",
      amount: 15000,
      paymentMethod: "credit_card",
      status: "completed",
      date: "2025-07-22T11:20:00Z",
      transactionId: "TXN789456126",
      hotel: { 
        name: "City Inn Galle", 
        location: "Galle", 
        accommodationType: "inn",
        address: "12 Fort Street, Galle",
        phone: "+94912345678"
      },
      room: { type: "standard", number: "105" },
      description: "Inn booking payment",
      currency: "LKR",
      checkIn: "2025-07-30T15:00:00Z",
      checkOut: "2025-08-02T11:00:00Z",
      nights: 3
    },
    {
      _id: "payment005",
      bookingId: "booking127",
      user: "David Brown",
      userEmail: "david.brown@email.com",
      userPhone: "+94771234571",
      amount: 35000,
      paymentMethod: "digital_wallet",
      status: "completed",
      date: "2025-07-18T13:10:00Z",
      transactionId: "TXN789456127",
      hotel: { 
        name: "Seaside Villa", 
        location: "Mirissa", 
        accommodationType: "villa",
        address: "23 Ocean View Road, Mirissa",
        phone: "+94412345678"
      },
      room: { type: "premium", number: "Villa A" },
      description: "Villa booking payment",
      currency: "LKR",
      checkIn: "2025-07-23T15:00:00Z",
      checkOut: "2025-07-26T11:00:00Z",
      nights: 3
    },
    {
      _id: "payment006",
      bookingId: "booking128",
      user: "Emma Davis",
      userEmail: "emma.davis@email.com",
      userPhone: "+94771234572",
      amount: 28000,
      paymentMethod: "credit_card",
      status: "completed",
      date: "2025-07-17T10:30:00Z",
      transactionId: "TXN789456128",
      hotel: { 
        name: "Grand Hotel Colombo", 
        location: "Colombo", 
        accommodationType: "hotel",
        address: "123 Galle Road, Colombo 03",
        phone: "+94112345678"
      },
      room: { type: "deluxe", number: "308" },
      description: "Hotel booking payment",
      currency: "LKR",
      checkIn: "2025-07-22T15:00:00Z",
      checkOut: "2025-07-25T11:00:00Z",
      nights: 3
    }
  ], []);

  // Function to generate and download PDF receipt
  const downloadReceipt = (payment) => {
    // Create a new window for the receipt
    const receiptWindow = window.open('', '_blank');
    
    // HTML content for the receipt
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt - ${payment.transactionId}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #4CAF50;
            margin: 0;
          }
          .receipt-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          .info-section h3 {
            color: #4CAF50;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .label {
            font-weight: bold;
          }
          .amount-section {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
          }
          .total-amount {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
          }
          .status {
            background: #4CAF50;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            text-transform: uppercase;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Payment Receipt</h1>
          <p>Thank you for your payment!</p>
        </div>

        <div class="receipt-info">
          <div class="info-section">
            <h3>Payment Details</h3>
            <div class="info-row">
              <span class="label">Transaction ID:</span>
              <span>${payment.transactionId}</span>
            </div>
            <div class="info-row">
              <span class="label">Payment Date:</span>
              <span>${formatDate(payment.date)} at ${formatTime(payment.date)}</span>
            </div>
            <div class="info-row">
              <span class="label">Payment Method:</span>
              <span>${formatPaymentMethod(payment.paymentMethod)}</span>
            </div>
            <div class="info-row">
              <span class="label">Status:</span>
              <span class="status">Completed</span>
            </div>
          </div>

          <div class="info-section">
            <h3>Customer Information</h3>
            <div class="info-row">
              <span class="label">Name:</span>
              <span>${payment.user}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span>${payment.userEmail}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone:</span>
              <span>${payment.userPhone}</span>
            </div>
            <div class="info-row">
              <span class="label">Booking ID:</span>
              <span>${payment.bookingId.slice(-8).toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3>Hotel & Booking Information</h3>
          <div class="info-row">
            <span class="label">Hotel:</span>
            <span>${payment.hotel.name}</span>
          </div>
          <div class="info-row">
            <span class="label">Address:</span>
            <span>${payment.hotel.address}</span>
          </div>
          <div class="info-row">
            <span class="label">Phone:</span>
            <span>${payment.hotel.phone}</span>
          </div>
          <div class="info-row">
            <span class="label">Room Type:</span>
            <span>${payment.room.type} (${payment.room.number})</span>
          </div>
          <div class="info-row">
            <span class="label">Check-in:</span>
            <span>${formatDate(payment.checkIn)} at ${formatTime(payment.checkIn)}</span>
          </div>
          <div class="info-row">
            <span class="label">Check-out:</span>
            <span>${formatDate(payment.checkOut)} at ${formatTime(payment.checkOut)}</span>
          </div>
          <div class="info-row">
            <span class="label">Number of Nights:</span>
            <span>${payment.nights}</span>
          </div>
        </div>

        <div class="amount-section">
          <p>Total Amount Paid</p>
          <div class="total-amount">${payment.currency} ${payment.amount.toLocaleString()}</div>
        </div>

        <div class="footer">
          <p>This is a computer-generated receipt. No signature required.</p>
          <p>For any queries, please contact us with your transaction ID: ${payment.transactionId}</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    // Write HTML to the new window
    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();

    // Wait for content to load, then trigger print dialog
    receiptWindow.onload = function() {
      setTimeout(() => {
        receiptWindow.print();
        // Close the window after printing (user can cancel)
        receiptWindow.onafterprint = function() {
          receiptWindow.close();
        };
      }, 250);
    };
  };

  // Function to format payment method
  const formatPaymentMethod = (method) => {
    switch (method) {
      case "credit_card":
        return "Credit Card";
      case "paypal":
        return "PayPal";
      case "bank_transfer":
        return "Bank Transfer";
      case "digital_wallet":
        return "Digital Wallet";
      default:
        return method;
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError("");
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, use dummy data
      setPayments(dummyPayments);
      
      // Extract unique hotel names
      const hotelNames = [...new Set(dummyPayments.map(payment => payment.hotel.name))];
      setHotels(hotelNames);
      
      // TODO: Replace with real API call
      // const token = localStorage.getItem('token');
      // if (!token) {
      //   setError('Authentication required to view payments.');
      //   setPayments([]);
      //   setLoading(false);
      //   return;
      // }
      // const response = await api.get('/payments/recent');
      // setPayments(response.data);
      
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Failed to fetch payments. Please try again later.");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [dummyPayments]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Filter payments based on status, method, and hotel
  const filteredPayments = payments.filter(payment => {
    // Status filter
    if (filterStatus !== "all") {
      if (payment.status !== filterStatus) return false;
    }
    
    // Payment method filter
    if (filterMethod !== "all") {
      if (payment.paymentMethod !== filterMethod) return false;
    }
    
    // Hotel filter
    if (filterHotel !== "all") {
      if (payment.hotel.name !== filterHotel) return false;
    }
    
    return true;
  });

  // Sort payments
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date) - new Date(a.date);
      case "amount":
        return b.amount - a.amount;
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // Calculate statistics - all payments are successful
  const stats = {
    total: payments.length,
    completed: payments.length, // All payments are completed
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0)
  };

  if (loading) {
    return (
      <div className="payments-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading payments data...</div>
        </div>
      </div>
    );
  }

  if (errors) {
    return (
      <div className="payments-page">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{errors}</span>
        </div>
        <div className="error-actions">
          <button className="retry-btn" onClick={fetchPayments}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-page">
      {/* Executive Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Payments Management</h1>
            <p className="page-subtitle">
              Monitor and track all payment transactions with real-time status updates and comprehensive financial analytics.
            </p>
          </div>
          
          <div className="header-stats">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Transactions</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">LKR {stats.totalRevenue.toLocaleString()}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-container">
          <div className="filter-left">
            <span className="filter-label">Status Filter:</span>
            <select 
              className="filter-dropdown"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Payments</option>
              <option value="completed">Completed</option>
            </select>

            <span className="filter-label">Payment Method:</span>
            <select 
              className="filter-dropdown"
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
            >
              <option value="all">All Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="digital_wallet">Digital Wallet</option>
            </select>

            <span className="filter-label">Hotel Filter:</span>
            <select 
              className="filter-dropdown"
              value={filterHotel}
              onChange={(e) => setFilterHotel(e.target.value)}
            >
              <option value="all">All Hotels</option>
              {hotels.map((hotelName, index) => (
                <option key={index} value={hotelName}>
                  {hotelName}
                </option>
              ))}
            </select>

            <span className="filter-label">Sort By:</span>
            <select 
              className="filter-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Transaction Date</option>
              <option value="amount">Amount</option>
              <option value="status">Status</option>
            </select>
          </div>
          
          <div className="filter-right">
            <div className="results-count">
              {sortedPayments.length} {sortedPayments.length === 1 ? 'Payment' : 'Payments'}
            </div>
            <button className="refresh-btn" onClick={fetchPayments}>
              <span className="btn-icon">🔄</span>
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="payments-container">
        <div className="quick-stats">
          <div className="quick-stat-card completed">
            <div className="quick-stat-number">{stats.completed}</div>
            <div className="quick-stat-label">Completed</div>
          </div>
          <div className="quick-stat-card pending">
            <div className="quick-stat-number">{stats.pending}</div>
            <div className="quick-stat-label">Pending</div>
          </div>
          <div className="quick-stat-card failed">
            <div className="quick-stat-number">{stats.failed}</div>
            <div className="quick-stat-label">Failed</div>
          </div>
          <div className="quick-stat-card refunded">
            <div className="quick-stat-number">{stats.refunded}</div>
            <div className="quick-stat-label">Refunded</div>
          </div>
        </div>

        {/* Payments Grid */}
        {sortedPayments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <h3 className="empty-title">No Payments Found</h3>
            <p className="empty-description">
              {filterStatus !== 'all' || filterMethod !== 'all' || filterHotel !== 'all'
                ? `No payments found for the selected filters.`
                : 'No payments have been processed yet.'}
            </p>
          </div>
        ) : (
          <div className="payments-grid">
            {sortedPayments.map((payment) => {
              return (
                <div key={payment._id} className="payment-card">
                  <div className="card-header">
                    <div className="payment-id">
                      <span className="id-label">Transaction ID:</span>
                      <span className="id-value">{payment.transactionId}</span>
                    </div>
                    <span className="status-badge status-badge--completed">
                      Completed
                    </span>
                  </div>
                  
                  <div className="payment-info">
                    <div className="info-section">
                      <h3 className="section-title">Payment Details</h3>
                      <div className="info-grid">
                        <div className="info-row">
                          <span className="info-label">Customer</span>
                          <span className="info-value">{payment.user}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Method</span>
                          <span className="info-value">{formatPaymentMethod(payment.paymentMethod)}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Booking ID</span>
                          <span className="info-value">{payment.bookingId.slice(-8).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h3 className="section-title">Hotel Information</h3>
                      <div className="info-grid">
                        <div className="info-row">
                          <span className="info-label">Property</span>
                          <span className="info-value">{payment.hotel.name}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Location</span>
                          <span className="info-value">{payment.hotel.location}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Room</span>
                          <span className="info-value capitalize">{payment.room.type} ({payment.room.number})</span>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h3 className="section-title">Stay Details</h3>
                      <div className="info-grid">
                        <div className="info-row">
                          <span className="info-label">Check-in</span>
                          <span className="info-value">{formatDate(payment.checkIn)}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Check-out</span>
                          <span className="info-value">{formatDate(payment.checkOut)}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Nights</span>
                          <span className="info-value">{payment.nights}</span>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h3 className="section-title">Transaction Info</h3>
                      <div className="transaction-details">
                        <div className="transaction-item">
                          <div className="transaction-label">Payment Date</div>
                          <div className="transaction-date">{formatDate(payment.date)}</div>
                          <div className="transaction-time">{formatTime(payment.date)}</div>
                        </div>
                        <div className="transaction-item">
                          <div className="transaction-label">Description</div>
                          <div className="transaction-description">{payment.description}</div>
                        </div>
                      </div>
                    </div>

                    <div className="amount-section">
                      <span className="amount-label">Amount Paid</span>
                      <span className="amount-value">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button className="action-btn action-btn--primary">
                      <span className="btn-icon">📄</span>
                      View Details
                    </button>
                    
                    <button 
                      className="action-btn action-btn--secondary"
                      onClick={() => downloadReceipt(payment)}
                    >
                      <span className="btn-icon">🧾</span>
                      Download Receipt
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccommodationPayments;