import { useState, useEffect } from 'react';
import { TripPlanningContext } from './TripPlanningContext.js';

export const TripPlanningProvider = ({ children }) => {
    const [planningBookings, setPlanningBookings] = useState({
        accommodations: [],
        transportation: [],
        guides: [],
        destinations: []
    });
    const [isInPlanningMode, setIsInPlanningMode] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('tripPlanningBookings');
        if (saved) {
            try {
                const parsedData = JSON.parse(saved);
                console.log('📦 TripPlanningContext: Loading data from localStorage:', parsedData);
                setPlanningBookings(parsedData);
            } catch (error) {
                console.error('Error loading trip planning bookings:', error);
            }
        } else {
            console.log('📦 TripPlanningContext: No saved data found in localStorage');
        }
    }, []);

    // Save to localStorage whenever bookings change
    useEffect(() => {
        localStorage.setItem('tripPlanningBookings', JSON.stringify(planningBookings));
    }, [planningBookings]);

    const addToTripPlanning = (booking, type) => {
        console.log('➕ TripPlanningContext: Adding booking:', { booking, type });
        setPlanningBookings(prev => {
            const newBookings = {
                ...prev,
                [type]: [...prev[type], { ...booking, addedAt: new Date().toISOString() }]
            };
            console.log('➕ TripPlanningContext: Updated bookings:', newBookings);
            return newBookings;
        });
    };

    const removeFromTripPlanning = (bookingId, type) => {
        setPlanningBookings(prev => ({
            ...prev,
            [type]: prev[type].filter(booking => booking.id !== bookingId)
        }));
    };

    const clearTripPlanning = () => {
        setPlanningBookings({
            accommodations: [],
            transportation: [],
            guides: [],
            destinations: []
        });
        localStorage.removeItem('tripPlanningBookings');
    };

    const getTotalAmount = () => {
        let total = 0;
        Object.values(planningBookings).forEach(bookings => {
            bookings.forEach(booking => {
                // Try different price fields that might exist
                const price = booking.totalPrice || booking.price || booking.cost || 0;
                total += Number(price) || 0;
            });
        });
        return total;
    };

    const getTotalItemsCount = () => {
        return Object.values(planningBookings).reduce((total, bookingType) => total + bookingType.length, 0);
    };

    const getPaymentSummary = () => {
        const summary = {
            items: [],
            totalAmount: 0,
            breakdown: {
                accommodations: { items: planningBookings.accommodations, subtotal: 0 },
                transportation: { items: planningBookings.transportation, subtotal: 0 },
                guides: { items: planningBookings.guides, subtotal: 0 },
                destinations: { items: planningBookings.destinations, subtotal: 0 }
            }
        };

        // Calculate breakdown and totals
        Object.keys(summary.breakdown).forEach(type => {
            const items = summary.breakdown[type].items;
            items.forEach(item => {
                const price = item.totalPrice || item.price || item.cost || 0;
                const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d]/g, '')) : Number(price);
                summary.breakdown[type].subtotal += numericPrice || 0;
                summary.items.push({
                    id: item.id,
                    name: item.name,
                    type: type.slice(0, -1), // Remove 's' from plural
                    price: numericPrice,
                    quantity: item.quantity || 1,
                    selectedDate: item.selectedDate,
                    addedAt: item.addedAt
                });
            });
            summary.totalAmount += summary.breakdown[type].subtotal;
        });

        return summary;
    };

    const value = {
        planningBookings,
        isInPlanningMode,
        setIsInPlanningMode,
        addToTripPlanning,
        removeFromTripPlanning,
        clearTripPlanning,
        getTotalAmount,
        getTotalItemsCount,
        getPaymentSummary
    };

    return (
        <TripPlanningContext.Provider value={value}>
            {children}
        </TripPlanningContext.Provider>
    );
};