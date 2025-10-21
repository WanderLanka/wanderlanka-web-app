import { useState, useEffect, useCallback, useMemo } from 'react';
import { CreditCard, Calendar, DollarSign, Download, Filter, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import { Button, Card, Breadcrumb } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';
import { paymentAPI } from '../../services/api';

const Payments = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch payments from API
    const fetchPayments = useCallback(async () => {
        setLoading(true);
        setError('');
        
        try {
            const payments = await paymentAPI.getUserPayments();
            setPayments(payments);
        } catch (error) {
            console.error('Error fetching payments:', error);
            setError('Failed to fetch payments. Please try again later.');
            setPayments([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    // Mock data for payments (fallback)
    const mockPayments = useMemo(() => [
        {
            id: 1,
            type: 'accommodation',
            description: 'Heritance Kandalama Hotel - 5 nights',
            amount: 450,
            currency: 'USD',
            status: 'completed',
            date: '2024-01-10',
            method: 'Credit Card',
            transactionId: 'TXN001245',
            bookingRef: 'HTL001'
        },
        {
            id: 2,
            type: 'transport',
            description: 'Airport Transfer - SUV',
            amount: 35,
            currency: 'USD',
            status: 'completed',
            date: '2024-01-08',
            method: 'PayPal',
            transactionId: 'TXN001244',
            bookingRef: 'TRP001'
        },
        {
            id: 3,
            type: 'experience',
            description: 'Sigiriya Rock Climbing Tour',
            amount: 85,
            currency: 'USD',
            status: 'pending',
            date: '2024-01-15',
            method: 'Bank Transfer',
            transactionId: 'TXN001246',
            bookingRef: 'EXP001'
        },
        {
            id: 4,
            type: 'package',
            description: 'Cultural Heritage Tour Package',
            amount: 1250,
            currency: 'USD',
            status: 'failed',
            date: '2024-01-12',
            method: 'Credit Card',
            transactionId: 'TXN001247',
            bookingRef: 'PKG001'
        },
        {
            id: 5,
            type: 'accommodation',
            description: 'Cinnamon Grand Colombo - 2 nights',
            amount: 320,
            currency: 'USD',
            status: 'refunded',
            date: '2024-01-05',
            method: 'Credit Card',
            transactionId: 'TXN001243',
            bookingRef: 'HTL002'
        }
    ], []);

    const paymentStats = useMemo(() => {
        const dataToUse = payments.length > 0 ? payments : mockPayments;
        const stats = dataToUse.reduce((acc, payment) => {
            const amount = payment.amount || 0;
            if (payment.status === 'completed') acc.completed += amount;
            if (payment.status === 'pending') acc.pending += amount;
            if (payment.status === 'refunded') acc.refunded += amount;
            acc.total += payment.status === 'completed' ? amount : 0;
            return acc;
        }, { total: 0, completed: 0, pending: 0, refunded: 0 });
        return stats;
    }, [payments, mockPayments]);

    const filterPayments = (status) => {
        const dataToUse = payments.length > 0 ? payments : mockPayments;
        if (status === 'all') return dataToUse;
        return dataToUse.filter(payment => payment.status === status);
    };

    const getStatusConfig = (status) => {
        const configs = {
            completed: { color: 'text-green-700 bg-green-100', icon: CheckCircle },
            pending: { color: 'text-yellow-700 bg-yellow-100', icon: Clock },
            failed: { color: 'text-red-700 bg-red-100', icon: XCircle },
            refunded: { color: 'text-blue-700 bg-blue-100', icon: CheckCircle }
        };
        return configs[status] || { color: 'text-gray-700 bg-gray-100', icon: Clock };
    };

    const getTypeIcon = (payment) => {
        // Handle both mock data and real API data
        const type = payment.serviceType || payment.type;
        switch (type) {
            case 'accommodation': return '🏨';
            case 'transport': return '🚗';
            case 'experience': return '🎯';
            case 'package': return '📦';
            default: return '💳';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb 
                        items={[
                            { label: 'Dashboard', path: '/user/dashboard', isHome: true },
                            { label: 'Payments', isActive: true }
                        ]} 
                    />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Payments</h1>
                    <p className="text-lg text-slate-600">Track your payment history and manage billing</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6 text-center">
                        <div className="text-3xl font-bold text-slate-800 mb-2">
                            ${paymentStats.total.toLocaleString()}
                        </div>
                        <p className="text-slate-600">Total Spent</p>
                    </Card>
                    <Card className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                            ${paymentStats.completed.toLocaleString()}
                        </div>
                        <p className="text-slate-600">Completed</p>
                    </Card>
                    <Card className="p-6 text-center">
                        <div className="text-3xl font-bold text-yellow-600 mb-2">
                            ${paymentStats.pending.toLocaleString()}
                        </div>
                        <p className="text-slate-600">Pending</p>
                    </Card>
                    <Card className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                            ${paymentStats.refunded.toLocaleString()}
                        </div>
                        <p className="text-slate-600">Refunded</p>
                    </Card>
                </div>

                {/* Filter and Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex flex-wrap gap-2">
                        {['all', 'completed', 'pending', 'failed', 'refunded'].map((tab) => (
                            <Button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                variant={activeTab === tab ? 'primary' : 'outline'}
                                size="md"
                                className="capitalize"
                            >
                                {tab === 'all' ? 'All Payments' : tab} 
                                ({filterPayments(tab).length})
                            </Button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="md"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </Button>
                        <Button 
                            variant="outline" 
                            size="md" 
                            onClick={fetchPayments}
                            disabled={loading}
                            className="flex items-center"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button variant="outline" size="md" className="flex items-center">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center space-x-2 text-slate-600">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Loading payments...</span>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <XCircle className="w-5 h-5 text-red-500 mr-2" />
                            <span className="text-red-700">{error}</span>
                        </div>
                    </div>
                )}

                {/* Payments List */}
                {!loading && !error && (
                    <div className="space-y-4">
                        {filterPayments(activeTab).map((payment) => {
                        const statusConfig = getStatusConfig(payment.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                            <Card key={payment._id || payment.id} className="p-6 hover:shadow-lg transition-all duration-200" hover={true}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="text-3xl">
                                            {getTypeIcon(payment)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800 mb-1">
                                                {payment.description || payment.paymentDetails?.description || `${payment.serviceType} payment`}
                                            </h3>
                                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                                                <span className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {new Date(payment.createdAt || payment.date).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center">
                                                    <CreditCard className="w-4 h-4 mr-1" />
                                                    {payment.paymentMethod || payment.method}
                                                </span>
                                                <span className="text-slate-500">
                                                    ID: {payment.paymentId || payment.transactionId}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-6">
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-slate-800">
                                                {payment.currency === 'LKR' ? 'Rs.' : '$'}{payment.amount}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {payment.currency || 'USD'}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <StatusIcon className="w-5 h-5" />
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                            </span>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                    </div>
                )}

                {!loading && !error && filterPayments(activeTab).length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">💳</div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">You haven't made any payments yet</h3>
                        <p className="text-slate-500 mb-4">
                            Start exploring our amazing accommodations, transportation, and experiences to make your first payment.
                        </p>
                        <Button 
                            onClick={() => window.location.href = '/accommodations'}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Start Exploring
                        </Button>
                    </div>
                )}

                {/* Payment Methods Section */}
                <div className="mt-12">
                    <Card className="p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Payment Methods</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center p-4 border border-slate-200 rounded-lg">
                                <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
                                <div>
                                    <p className="font-medium text-slate-800">Credit Card</p>
                                    <p className="text-sm text-slate-600">**** 1234</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 border border-slate-200 rounded-lg">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center mr-3">
                                    P
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">PayPal</p>
                                    <p className="text-sm text-slate-600">john@example.com</p>
                                </div>
                            </div>
                            <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
                                <span className="text-2xl mr-2">+</span>
                                Add Payment Method
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
            <TravelerFooter />
        </div>
    );
};

export default Payments;