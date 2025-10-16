import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Edit3, Shield, Bell, Globe, CreditCard } from 'lucide-react';
import { Button, Card, Input, Breadcrumb } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    
    // Mock user data
    const [userData, setUserData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, USA',
        dateOfBirth: '1990-05-15',
        bio: 'Travel enthusiast exploring the beautiful landscapes of Sri Lanka',
        joinedDate: '2023-01-15',
        avatar: '/api/placeholder/150/150',
        preferences: {
            currency: 'USD',
            language: 'English',
            notifications: {
                email: true,
                sms: false,
                push: true
            },
            privacy: {
                showProfile: true,
                showTravelHistory: false
            }
        }
    });

    const [stats] = useState({
        tripsCompleted: 12,
        countriesVisited: 8,
        totalSpent: 5420,
        reviewsGiven: 24
    });

    const tabs = [
        { key: 'personal', label: 'Personal Info', icon: User },
        { key: 'preferences', label: 'Preferences', icon: Globe },
        { key: 'notifications', label: 'Notifications', icon: Bell },
        { key: 'privacy', label: 'Privacy', icon: Shield }
    ];

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically save to backend
        console.log('Saving user data:', userData);
    };

    const handleInputChange = (field, value) => {
        setUserData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePreferenceChange = (category, field, value) => {
        setUserData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [category]: {
                    ...prev.preferences[category],
                    [field]: value
                }
            }
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb 
                        items={[
                            { label: 'Dashboard', path: '/user/dashboard', isHome: true },
                            { label: 'Profile', isActive: true }
                        ]} 
                    />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">My Profile</h1>
                    <p className="text-lg text-slate-600">Manage your account settings and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Summary */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 text-center mb-6">
                            <div className="relative inline-block mb-4">
                                <img
                                    src={userData.avatar}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full mx-auto object-cover"
                                />
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="absolute -bottom-2 -right-2 rounded-full p-2"
                                >
                                    <Camera className="w-4 h-4" />
                                </Button>
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">
                                {userData.firstName} {userData.lastName}
                            </h2>
                            <p className="text-slate-600 mb-4">{userData.bio}</p>
                            <div className="flex items-center justify-center text-slate-500 mb-4">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span className="text-sm">
                                    Joined {new Date(userData.joinedDate).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long' 
                                    })}
                                </span>
                            </div>
                        </Card>

                        {/* Stats */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Travel Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Trips Completed</span>
                                    <span className="font-semibold text-slate-800">{stats.tripsCompleted}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Countries Visited</span>
                                    <span className="font-semibold text-slate-800">{stats.countriesVisited}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Total Spent</span>
                                    <span className="font-semibold text-slate-800">${stats.totalSpent.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Reviews Given</span>
                                    <span className="font-semibold text-slate-800">{stats.reviewsGiven}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Profile Details */}
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            {/* Tabs */}
                            <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                                                activeTab === tab.key
                                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                                    : 'text-slate-600 hover:text-slate-800'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4 mr-2" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Personal Info Tab */}
                            {activeTab === 'personal' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-slate-800">Personal Information</h3>
                                        <Button
                                            variant={isEditing ? 'primary' : 'outline'}
                                            size="sm"
                                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                            className="flex items-center"
                                        >
                                            <Edit3 className="w-4 h-4 mr-2" />
                                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                First Name
                                            </label>
                                            {isEditing ? (
                                                <Input
                                                    type="text"
                                                    value={userData.firstName}
                                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                />
                                            ) : (
                                                <p className="text-slate-800 font-medium">{userData.firstName}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Last Name
                                            </label>
                                            {isEditing ? (
                                                <Input
                                                    type="text"
                                                    value={userData.lastName}
                                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                />
                                            ) : (
                                                <p className="text-slate-800 font-medium">{userData.lastName}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Email
                                            </label>
                                            <div className="flex items-center">
                                                <Mail className="w-4 h-4 text-slate-500 mr-2" />
                                                {isEditing ? (
                                                    <Input
                                                        type="email"
                                                        value={userData.email}
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                    />
                                                ) : (
                                                    <p className="text-slate-800">{userData.email}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Phone
                                            </label>
                                            <div className="flex items-center">
                                                <Phone className="w-4 h-4 text-slate-500 mr-2" />
                                                {isEditing ? (
                                                    <Input
                                                        type="tel"
                                                        value={userData.phone}
                                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                                    />
                                                ) : (
                                                    <p className="text-slate-800">{userData.phone}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Location
                                            </label>
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 text-slate-500 mr-2" />
                                                {isEditing ? (
                                                    <Input
                                                        type="text"
                                                        value={userData.location}
                                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                                    />
                                                ) : (
                                                    <p className="text-slate-800">{userData.location}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Date of Birth
                                            </label>
                                            {isEditing ? (
                                                <Input
                                                    type="date"
                                                    value={userData.dateOfBirth}
                                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                                />
                                            ) : (
                                                <p className="text-slate-800">
                                                    {new Date(userData.dateOfBirth).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Bio
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows="3"
                                                value={userData.bio}
                                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-slate-800">{userData.bio}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-slate-800">Preferences</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Currency
                                            </label>
                                            <select 
                                                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={userData.preferences.currency}
                                                onChange={(e) => handlePreferenceChange('', 'currency', e.target.value)}
                                            >
                                                <option value="USD">USD - US Dollar</option>
                                                <option value="EUR">EUR - Euro</option>
                                                <option value="GBP">GBP - British Pound</option>
                                                <option value="LKR">LKR - Sri Lankan Rupee</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Language
                                            </label>
                                            <select 
                                                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={userData.preferences.language}
                                                onChange={(e) => handlePreferenceChange('', 'language', e.target.value)}
                                            >
                                                <option value="English">English</option>
                                                <option value="Sinhala">Sinhala</option>
                                                <option value="Tamil">Tamil</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-slate-800">Notification Settings</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-slate-800">Email Notifications</h4>
                                                <p className="text-sm text-slate-600">Receive booking confirmations and updates via email</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={userData.preferences.notifications.email}
                                                    onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-slate-800">SMS Notifications</h4>
                                                <p className="text-sm text-slate-600">Receive important updates via text message</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={userData.preferences.notifications.sms}
                                                    onChange={(e) => handlePreferenceChange('notifications', 'sms', e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-slate-800">Push Notifications</h4>
                                                <p className="text-sm text-slate-600">Receive notifications in your browser</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={userData.preferences.notifications.push}
                                                    onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Privacy Tab */}
                            {activeTab === 'privacy' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-slate-800">Privacy Settings</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-slate-800">Public Profile</h4>
                                                <p className="text-sm text-slate-600">Allow others to see your public profile information</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={userData.preferences.privacy.showProfile}
                                                    onChange={(e) => handlePreferenceChange('privacy', 'showProfile', e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-slate-800">Travel History</h4>
                                                <p className="text-sm text-slate-600">Show your travel history to other users</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={userData.preferences.privacy.showTravelHistory}
                                                    onChange={(e) => handlePreferenceChange('privacy', 'showTravelHistory', e.target.checked)}
                                                />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-200">
                                        <h4 className="font-medium text-slate-800 mb-4">Account Management</h4>
                                        <div className="space-y-3">
                                            <Button variant="outline" size="md" className="w-full justify-start">
                                                Download My Data
                                            </Button>
                                            <Button variant="outline" size="md" className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50">
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
            <TravelerFooter />
        </div>
    );
};

export default Profile;