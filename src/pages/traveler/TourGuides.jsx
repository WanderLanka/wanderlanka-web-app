import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Users, Globe, Clock, Award, Languages } from 'lucide-react';
import { Button, Card, Input, Breadcrumb } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';

const TourGuides = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');
    const [languageFilter, setLanguageFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');

    // Mock data for tour guides
    const mockTourGuides = useMemo(() => [
        {
            id: 12,
            name: 'Cultural Heritage Tour Guide',
            provider: 'Heritage Walks',
            location: 'Kandy, Sri Lanka',
            rating: 4.7,
            reviews: 203,
            price: 35,
            priceUnit: 'hour',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
            features: ['Multi-lingual', 'Licensed', 'Historical Expert', 'Cultural Stories'],
            availability: 'Available',
            description: 'Expert guide for cultural sites and historical landmarks',
            specialty: 'Cultural',
            languages: ['English', 'Sinhala', 'Tamil'],
            experience: '8 years',
            guideName: 'Pradeep Silva'
        },
        {
            id: 13,
            name: 'Wildlife Safari Guide',
            provider: 'Safari Experts',
            location: 'Yala National Park, Sri Lanka',
            rating: 4.9,
            reviews: 156,
            price: 50,
            priceUnit: 'day',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800',
            features: ['Wildlife Expert', 'Photography Tips', 'Conservation Knowledge', 'Early Bird Tours'],
            availability: 'Available',
            description: 'Experienced wildlife guide specializing in Sri Lankan fauna',
            specialty: 'Wildlife',
            languages: ['English', 'German'],
            experience: '12 years',
            guideName: 'Roshan Perera'
        },
        {
            id: 14,
            name: 'Adventure Hiking Guide',
            provider: 'Mountain Adventures',
            location: 'Ella, Sri Lanka',
            rating: 4.6,
            reviews: 134,
            price: 40,
            priceUnit: 'day',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800',
            features: ['Mountain Expert', 'Safety Certified', 'Equipment Provided', 'Route Planning'],
            availability: 'Limited',
            description: 'Professional hiking guide for mountain trails and adventures',
            specialty: 'Adventure',
            languages: ['English', 'French'],
            experience: '6 years',
            guideName: 'Chaminda Fernando'
        },
        {
            id: 15,
            name: 'Cooking Experience Guide',
            provider: 'Culinary Tours',
            location: 'Colombo, Sri Lanka',
            rating: 4.8,
            reviews: 89,
            price: 45,
            priceUnit: 'session',
            image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800',
            features: ['Cooking Classes', 'Market Tours', 'Recipe Cards', 'Traditional Methods'],
            availability: 'Available',
            description: 'Learn authentic Sri Lankan cooking with local chef guide',
            specialty: 'Culinary',
            languages: ['English', 'Sinhala'],
            experience: '10 years',
            guideName: 'Malini Jayawardena'
        },
        {
            id: 16,
            name: 'Tea Plantation Guide',
            provider: 'Ceylon Tea Tours',
            location: 'Nuwara Eliya, Sri Lanka',
            rating: 4.5,
            reviews: 167,
            price: 30,
            priceUnit: 'tour',
            image: 'https://images.unsplash.com/photo-1594736797933-d0a4ba0ccfec?w=800',
            features: ['Tea Expert', 'Factory Tours', 'Tasting Sessions', 'History Knowledge'],
            availability: 'Available',
            description: 'Discover the art of Ceylon tea making with expert guide',
            specialty: 'Cultural',
            languages: ['English', 'Japanese'],
            experience: '5 years',
            guideName: 'Thilak Rathnayake'
        },
        {
            id: 17,
            name: 'Beach & Water Sports Guide',
            provider: 'Ocean Adventures',
            location: 'Mirissa, Sri Lanka',
            rating: 4.4,
            reviews: 198,
            price: 38,
            priceUnit: 'day',
            image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=800',
            features: ['Water Sports', 'Whale Watching', 'Snorkeling', 'Beach Safety'],
            availability: 'Available',
            description: 'Water sports and marine life expert for coastal adventures',
            specialty: 'Adventure',
            languages: ['English', 'Italian'],
            experience: '7 years',
            guideName: 'Nimal Costa'
        }
    ], []);

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
        let filtered = mockTourGuides;
        
        if (searchTerm) {
            filtered = filtered.filter(guide =>
                guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guide.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guide.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guide.guideName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guide.specialty.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (specialtyFilter !== 'all') {
            filtered = filtered.filter(guide => guide.specialty === specialtyFilter);
        }

        if (languageFilter !== 'all') {
            filtered = filtered.filter(guide => guide.languages.includes(languageFilter));
        }

        if (priceFilter !== 'all') {
            const range = priceRanges.find(r => r.key === priceFilter);
            if (range) {
                filtered = filtered.filter(guide => guide.price >= range.min && guide.price <= range.max);
            }
        }
        
        return filtered;
    }, [mockTourGuides, searchTerm, specialtyFilter, languageFilter, priceFilter, priceRanges]);

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
            </div>
            <TravelerFooter />
        </div>
    );
};

export default TourGuides;