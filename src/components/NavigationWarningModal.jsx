import { X, AlertTriangle } from 'lucide-react';
import { Button } from './common';

const NavigationWarningModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <AlertTriangle className="w-6 h-6 text-amber-500 mr-3" />
                        <h2 className="text-xl font-bold text-gray-900">Leave Trip Planning?</h2>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <p className="text-gray-600 mb-3">
                        You have unsaved progress in your trip planning. If you leave this page, your current planning progress will be lost.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-amber-800 text-sm">
                            <strong>Note:</strong> Items you've already added to your trip summary will be saved, but any current selections or progress will be lost.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1"
                    >
                        Stay on Page
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onConfirm}
                        className="flex-1 bg-amber-600 hover:bg-amber-700"
                    >
                        Leave Anyway
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NavigationWarningModal;