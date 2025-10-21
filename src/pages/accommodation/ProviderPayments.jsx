import { useState, useEffect, useCallback, useMemo } from "react";
import { CreditCard, Calendar, DollarSign, Download, Filter, CheckCircle, Clock, XCircle, RefreshCw, TrendingUp, Users, Building } from "lucide-react";
import { Button, Card, Breadcrumb } from "../../components/common";
import { paymentAPI } from "../../services/api";

const ProviderPayments = () => {
  const [payments, setPayments] = useState([]);
  const [errors, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Fetch payments from the new API endpoint
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError("");
    
    try {
      // Use the paymentAPI service with proper authentication
      const payments = await paymentAPI.getAccommodationPayments();
      setPayments(payments);
      
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Failed to fetch payments. Please try again later.");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Filter payments based on status and method
  const filteredPayments = payments.filter(payment => {
    // Status filter
    if (filterStatus !== "all") {
      if (payment.status !== filterStatus) return false;
    }
    
    // Payment method filter
    if (filterMethod !== "all") {
      if (payment.paymentMethod !== filterMethod) return false;
    }
    
    return true;
  });

  // Sort payments
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "amount":
        return b.amount - a.amount;
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // Calculate statistics
  const stats = useMemo(() => {
    return payments.reduce((acc, payment) => {
      acc.total += 1;
      acc.totalAmount += payment.amount;
      
      if (payment.status === 'completed') {
        acc.completed += 1;
        acc.completedAmount += payment.amount;
      } else if (payment.status === 'pending') {
        acc.pending += 1;
        acc.pendingAmount += payment.amount;
      } else if (payment.status === 'failed') {
        acc.failed += 1;
        acc.failedAmount += payment.amount;
      } else if (payment.status === 'refunded') {
        acc.refunded += 1;
        acc.refundedAmount += payment.amount;
      }
      
      return acc;
    }, {
      total: 0,
      completed: 0,
      pending: 0,
      failed: 0,
      refunded: 0,
      totalAmount: 0,
      completedAmount: 0,
      pendingAmount: 0,
      failedAmount: 0,
      refundedAmount: 0
    });
  }, [payments]);

  const getStatusConfig = (status) => {
    const configs = {
      completed: { color: 'text-green-700 bg-green-100', icon: CheckCircle },
      pending: { color: 'text-yellow-700 bg-yellow-100', icon: Clock },
      failed: { color: 'text-red-700 bg-red-100', icon: XCircle },
      refunded: { color: 'text-blue-700 bg-blue-100', icon: CheckCircle }
    };
    return configs[status] || { color: 'text-gray-700 bg-gray-100', icon: Clock };
  };

  const formatPaymentMethod = (method) => {
    switch (method) {
      case "credit_card":
        return "Credit Card";
      case "stripe_checkout":
        return "Stripe Checkout";
      case "paypal":
        return "PayPal";
      case "bank_transfer":
        return "Bank Transfer";
      case "digital_wallet":
        return "Digital Wallet";
      default:
        return method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-slate-600">Loading payments data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errors) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Error Loading Payments</h3>
            <p className="text-slate-500 mb-6">{errors}</p>
            <Button onClick={fetchPayments} variant="primary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb 
            items={[
              { label: 'Dashboard', path: '/accommodation', isHome: true },
              { label: 'Payments', isActive: true }
            ]} 
          />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Payment Management</h1>
          <p className="text-lg text-slate-600">Track and manage your accommodation payment transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-slate-800 mb-2">
              {stats.total}
            </div>
            <p className="text-slate-600">Total Transactions</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.completed}
            </div>
            <p className="text-slate-600">Completed</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {stats.pending}
            </div>
            <p className="text-slate-600">Pending</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              LKR {stats.completedAmount.toLocaleString()}
            </div>
            <p className="text-slate-600">Total Revenue</p>
          </Card>
        </div>

        {/* Filter and Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {['all', 'completed', 'pending', 'failed', 'refunded'].map((tab) => (
              <Button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                variant={filterStatus === tab ? 'primary' : 'outline'}
                size="md"
                className="capitalize"
              >
                {tab === 'all' ? 'All Payments' : tab} 
                ({tab === 'all' ? stats.total : stats[tab]})
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <select 
              className="px-3 py-2 border border-slate-300 rounded-md text-sm"
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
            >
              <option value="all">All Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="stripe_checkout">Stripe Checkout</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="digital_wallet">Digital Wallet</option>
            </select>
            <select 
              className="px-3 py-2 border border-slate-300 rounded-md text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="status">Sort by Status</option>
            </select>
            <Button
              variant="outline"
              size="md"
              onClick={fetchPayments}
              className="flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Payments List */}
        <div className="space-y-4">
          {sortedPayments.map((payment) => {
            const statusConfig = getStatusConfig(payment.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card key={payment._id} className="p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">
                      🏨
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-1">
                        {payment.description}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(payment.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-1" />
                          {formatPaymentMethod(payment.paymentMethod)}
                        </span>
                        <span className="text-slate-500">
                          ID: {payment.paymentId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-800">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-500">
                        {payment.customerInfo?.name || 'Customer'}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusIcon className="w-5 h-5" />
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Receipt
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {sortedPayments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No payments found</h3>
            <p className="text-slate-500">
              You don't have any {filterStatus === 'all' ? '' : filterStatus} payments yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderPayments;
