import { useContext } from 'react';
import { TripPlanningContext } from '../contexts/TripPlanningContext.js';

export const useTripPlanning = () => {
    const context = useContext(TripPlanningContext);
    if (!context) {
        throw new Error('useTripPlanning must be used within a TripPlanningProvider');
    }
    return context;
};