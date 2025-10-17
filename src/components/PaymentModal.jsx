import { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { Button, Input, Card } from './common';

const PaymentModal = ({ isOpen, onClose, bookingData, totalAmount, onPaymentSuccess }) => {
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: '',
        billingEmail: '',
        billingPhone: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);

    const handleInputChange = (field, value) => {
        setPaymentData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatCardNumber = (value) => {
        // Remove non-digits and add spaces every 4 digits
        const digits = value.replace(/\D/g, '');
        const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
        return formatted.substring(0, 19); // Max 16 digits + 3 spaces
    };

    const formatExpiryDate = (value) => {
        // Remove non-digits and add slash after 2 digits
        const digits = value.replace(/\D/g, '');
        if (digits.length >= 2) {
            return digits.substring(0, 2) + '/' + digits.substring(2, 4);
        }
        return digits;
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setPaymentComplete(true);
            
            // Auto close after success
            setTimeout(() => {
                setPaymentComplete(false);
                onClose();
                if (onPaymentSuccess) {
                    onPaymentSuccess();
                } else {
                    alert('Payment successful! Booking confirmed.');
                }
            }, 2000);
        }, 2000);
    };

    const isFormValid = () => {
        return paymentData.cardNumber.replace(/\s/g, '').length === 16 &&
               paymentData.expiryDate.length === 5 &&
               paymentData.cvv.length === 3 &&
               paymentData.cardHolderName.trim() &&
               paymentData.billingEmail.includes('@');
    };

    if (!isOpen) return null;

    if (paymentComplete) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                    <p className="text-gray-600">Your booking has been confirmed. You will receive a confirmation email shortly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Booking Summary */}
                    <Card className="p-4 bg-gray-50">
                        <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Service:</span>
                                <span className="font-medium">{bookingData?.name || 'Service Name'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Provider:</span>
                                <span>{bookingData?.provider || 'Provider Name'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Location:</span>
                                <span>{bookingData?.location || 'Location'}</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total Amount:</span>
                                    <span className="text-blue-600">${totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Payment Form */}
                    <div className="space-y-4">
                        <div className="flex items-center mb-4">
                            <Lock className="w-5 h-5 text-green-600 mr-2" />
                            <span className="text-sm text-gray-600">Your payment information is secure and encrypted</span>
                        </div>

                        {/* Card Information */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Card Number
                                </label>
                                <Input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    value={paymentData.cardNumber}
                                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                                    maxLength={19}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Expiry Date
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="MM/YY"
                                        value={paymentData.expiryDate}
                                        onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                                        maxLength={5}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CVV
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="123"
                                        value={paymentData.cvv}
                                        onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                                        maxLength={3}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cardholder Name
                                </label>
                                <Input
                                    type="text"
                                    placeholder="John Doe"
                                    value={paymentData.cardHolderName}
                                    onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={paymentData.billingEmail}
                                    onChange={(e) => handleInputChange('billingEmail', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <Input
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                    value={paymentData.billingPhone}
                                    onChange={(e) => handleInputChange('billingPhone', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            <Lock className="w-4 h-4 inline mr-1" />
                            SSL Encrypted Payment
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={isProcessing}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handlePayment}
                                disabled={!isFormValid() || isProcessing}
                                className="flex items-center"
                            >
                                <CreditCard className="w-4 h-4 mr-2" />
                                {isProcessing ? 'Processing...' : `Pay $${totalAmount}`}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;