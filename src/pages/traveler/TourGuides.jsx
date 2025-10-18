import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Users, Globe, Clock, Award, Languages, Loader2 } from 'lucide-react';
import { Button, Card, Input, Breadcrumb } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';
import { tourGuideAPI } from '../../services/api';

const TourGuides = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');
    const [languageFilter, setLanguageFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');
    const [tourGuides, setTourGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTourGuides();
    }, []);

    const fetchTourGuides = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await tourGuideAPI.getAll();
            console.log('Tour Guide API Response:', response);
            setTourGuides(response || []);
        } catch (err) {
            setError('Failed to load tour guides. Please try again.');
            console.error('Error fetching tour guides:', err);
        } finally {
            setLoading(false);
        }
    };

    const specialties = useMemo(() => [
        { key: 'all', label: 'All Specialties' },
        { key: 'Cultural', label: 'Cultural' },
        { key: 'Wildlife', label: 'Wildlife' },
        { key: 'Adventure', label: 'Adventure' },
        { key: 'Culinary', label: 'Culinary' }
    ], []);

    const languages = useMemo(() => [
        { key: 'all', label: 'All Languages' },
        { key: 'English', label: 'English' },
        { key: 'German', label: 'German' },
        { key: 'French', label: 'French' },
        { key: 'Japanese', label: 'Japanese' },
        { key: 'Italian', label: 'Italian' }
    ], []);

    const priceRanges = useMemo(() => [
        { key: 'all', label: 'All Prices' },
        { key: 'budget', label: 'Under $40', min: 0, max: 40 },
        { key: 'standard', label: '$40 - $50', min: 40, max: 50 },
        { key: 'premium', label: 'Over $50', min: 50, max: 1000 }
    ], []);

    const filteredTourGuides = useMemo(() => {
        let filtered = tourGuides;
        
        if (searchTerm) {
            filtered = filtered.filter(guide =>
                guide.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guide.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guide.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guide.guideName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guide.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (specialtyFilter !== 'all') {
            filtered = filtered.filter(guide => guide.specialty === specialtyFilter);
        }

        if (languageFilter !== 'all') {
            filtered = filtered.filter(guide => guide.languages?.includes(languageFilter));
        }

        if (priceFilter !== 'all') {
            const range = priceRanges.find(r => r.key === priceFilter);
            if (range) {
                filtered = filtered.filter(guide => guide.price >= range.min && guide.price <= range.max);
            }
        }
        
        return filtered;
    }, [tourGuides, searchTerm, specialtyFilter, languageFilter, priceFilter, priceRanges]);

    const getAvailabilityColor = (availability) => {
        switch (availability.toLowerCase()) {
            case 'available': return 'bg-green-100 text-green-700';
            case 'limited': return 'bg-yellow-100 text-yellow-700';
            case 'unavailable': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
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
                            { label: 'Services'},
                            { label: 'Tour Guides', isActive: true }
                        ]} 
                    />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Tour Guides</h1>
                    <p className="text-lg text-slate-600">Expert local guides to enhance your travel experience in Sri Lanka</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-slate-600">Loading tour guides...</span>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                        <div className="text-red-800 font-medium mb-2">Error Loading Tour Guides</div>
                        <div className="text-red-600 mb-4">{error}</div>
                        <Button 
                            onClick={fetchTourGuides}
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Content - only show when not loading and no error */}
                {!loading && !error && (
                    <>
                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="max-w-md">
                        <Input
                            type="text"
                            placeholder="Search guides, specialties, locations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                            icon={Search}
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="space-y-3">
                        {/* Specialty Filter */}
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-medium text-slate-700 self-center mr-2">Specialty:</span>
                            {specialties.map((specialty) => (
                                <Button
                                    key={specialty.key}
                                    onClick={() => setSpecialtyFilter(specialty.key)}
                                    variant={specialtyFilter === specialty.key ? 'primary' : 'outline'}
                                    size="sm"
                                >
                                    {specialty.label}
                                </Button>
                            ))}
                        </div>

                        {/* Language Filter */}
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-medium text-slate-700 self-center mr-2">Languages:</span>
                            {languages.map((language) => (
                                <Button
                                    key={language.key}
                                    onClick={() => setLanguageFilter(language.key)}
                                    variant={languageFilter === language.key ? 'primary' : 'outline'}
                                    size="sm"
                                    className="flex items-center"
                                >
                                    <Globe className="w-3 h-3 mr-1" />
                                    {language.label}
                                </Button>
                            ))}
                        </div>

                        {/* Price Filter */}
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-medium text-slate-700 self-center mr-2">Price Range:</span>
                            {priceRanges.map((range) => (
                                <Button
                                    key={range.key}
                                    onClick={() => setPriceFilter(range.key)}
                                    variant={priceFilter === range.key ? 'primary' : 'outline'}
                                    size="sm"
                                >
                                    {range.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tour Guides Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTourGuides.map((guide) => (
                        <Card
                            key={guide.id}
                            className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            hover={true}
                            padding="none"
                        >
                            <div className="relative">
                                <img
                                    src={guide.image}
                                    alt={guide.guideName}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(guide.availability)}`}>
                                        {guide.availability}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1">
                                    <span className="text-sm font-medium text-slate-700">
                                        {guide.specialty}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-1">{guide.name}</h3>
                                <p className="text-sm font-medium text-blue-600 mb-2">{guide.guideName}</p>
                                <p className="text-sm text-slate-600 mb-3">{guide.provider}</p>
                                
                                <div className="flex items-center text-slate-600 mb-3">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{guide.location}</span>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                        <span className="text-sm font-medium text-slate-700">
                                            {guide.rating}
                                        </span>
                                        <span className="text-sm text-slate-500 ml-1">
                                            ({guide.reviews} reviews)
                                        </span>
                                    </div>
                                    <div className="flex items-center text-slate-600">
                                        <Award className="w-4 h-4 mr-1" />
                                        <span className="text-sm">{guide.experience}</span>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                    {guide.description}
                                </p>

                                {/* Languages */}
                                <div className="mb-4">
                                    <div className="flex items-center mb-2">
                                        <Languages className="w-4 h-4 mr-2 text-slate-500" />
                                        <span className="text-sm font-medium text-slate-700">Languages:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {guide.languages.map((language, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                                            >
                                                {language}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-1">
                                        {guide.features.slice(0, 3).map((feature, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                        {guide.features.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                                                +{guide.features.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                    <div>
                                        <span className="text-2xl font-bold text-slate-800">
                                            ${guide.price}
                                        </span>
                                        <span className="text-sm text-slate-500">
                                            /{guide.priceUnit}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => navigate(`/user/tour-guides/${guide.id}`)}
                                        >
                                            Details
                                        </Button>
                                        <Button 
                                            variant="primary" 
                                            size="sm"
                                            disabled={guide.availability === 'Unavailable'}
                                        >
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredTourGuides.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No tour guides found</h3>
                        <p className="text-slate-500">
                            No tour guides match your current filters.
                        </p>
                        <Button
                            variant="primary"
                            size="md"
                            className="mt-4"
                            onClick={() => {
                                setSearchTerm('');
                                setSpecialtyFilter('all');
                                setLanguageFilter('all');
                                setPriceFilter('all');
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
                </>
                )}
            </div>
            <TravelerFooter />
        </div>
    );
};

export default TourGuides;