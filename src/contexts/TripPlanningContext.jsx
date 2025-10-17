import { useState, useEffect } from 'react';
import { TripPlanningContext } from './TripPlanningContext.js';

export const TripPlanningProvider = ({ children }) => {
    const [planningBookings, setPlanningBookings] = useState({
        accommodations: [],
        transportation: [],
        guides: []
    });
    const [isInPlanningMode, setIsInPlanningMode] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('tripPlanningBookings');
        if (saved) {
            try {
                setPlanningBookings(JSON.parse(saved));
            } catch (error) {
                console.error('Error loading trip planning bookings:', error);
            }
        }
    }, []);

    // Save to localStorage whenever bookings change
    useEffect(() => {
        localStorage.setItem('tripPlanningBookings', JSON.stringify(planningBookings));
    }, [planningBookings]);

    const addToTripPlanning = (booking, type) => {
        setPlanningBookings(prev => ({
            ...prev,
            [type]: [...prev[type], { ...booking, addedAt: new Date().toISOString() }]
        }));
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
            guides: []
        });
        localStorage.removeItem('tripPlanningBookings');
    };

    const getTotalAmount = () => {
        let total = 0;
        Object.values(planningBookings).forEach(bookingType => {
            bookingType.forEach(booking => {
                total += booking.totalPrice || booking.price || 0;
            });
        });
        return total;
    };

    const getTotalItemsCount = () => {
        return Object.values(planningBookings).reduce((total, bookingType) => total + bookingType.length, 0);
    };

    const value = {
        planningBookings,
        isInPlanningMode,
        setIsInPlanningMode,
        addToTripPlanning,
        removeFromTripPlanning,
        clearTripPlanning,
        getTotalAmount,
        getTotalItemsCount
    };

    return (
        <TripPlanningContext.Provider value={value}>
            {children}
        </TripPlanningContext.Provider>
    );
};