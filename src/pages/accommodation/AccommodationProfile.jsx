import React, { useMemo } from 'react';
import { Card } from '../../components/common';

const AccommodationProfile = () => {
  const provider = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Accommodation Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Account Details</h2>
          <div className="space-y-3 text-slate-700">
            <div>
              <span className="text-slate-500 mr-2">Name:</span>
              <span>{provider?.name || 'Accommodation Provider'}</span>
            </div>
            <div>
              <span className="text-slate-500 mr-2">Email:</span>
              <span>{provider?.email || 'provider@example.com'}</span>
            </div>
            <div>
              <span className="text-slate-500 mr-2">Role:</span>
              <span>{provider?.role || 'accommodation'}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <ul className="space-y-3 list-disc list-inside text-slate-700">
            <li>Update profile information</li>
            <li>Manage hotels and rooms</li>
            <li>View payout settings</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AccommodationProfile;


