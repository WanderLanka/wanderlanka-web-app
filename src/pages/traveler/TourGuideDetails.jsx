import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
    ArrowLeft, 
    Star, 
    MapPin, 
    CheckCircle,
    Plus,
    Minus,
    Heart,
    Share2,
    Users,
    Clock,
    Languages,
    Camera,
    Globe,
    Calendar,
    BookOpen
} from 'lucide-react';
import { Button, Card, Input, Breadcrumb } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';
import PaymentModal from '../../components/PaymentModal';
import { useTripPlanning } from '../../hooks/useTripPlanning';

const TourGuideDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToTripPlanning } = useTripPlanning();
    
    const [currentImage, setCurrentImage] = useState(0);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        tourDate: '',
        duration: 4,
        groupSize: 1,
        tourType: 'cultural',
        specialRequests: ''
    });

    // Mock tour guide data
    const mockTourGuides = [
        {
            id: 12,
            name: 'Cultural Heritage Tour Guide',
            guideName: 'Pradeep Silva',
            provider: 'Heritage Walks',
            location: 'Kandy, Sri Lanka',
            rating: 4.7,
            reviews: 203,
            price: 35,
            priceUnit: 'hour',
            images: [
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
                'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
            ],
            features: ['Multi-lingual', 'Licensed', 'Historical Expert', 'Cultural Stories'],
            availability: 'Available',
            description: 'Welcome! I\'m Pradeep Silva, a passionate cultural heritage guide with over 8 years of experience sharing the rich history and traditions of Sri Lanka. Born and raised in Kandy, I have deep knowledge of ancient temples, royal palaces, and traditional customs. I specialize in making history come alive through engaging storytelling and immersive cultural experiences. Whether you\'re interested in Buddhist philosophy, colonial architecture, or traditional crafts, I\'ll provide you with authentic insights that go beyond typical tourist experiences.',
            amenities: ['Licensed Tour Guide', 'Historical Knowledge', 'Cultural Expertise', 'Flexible Timing', 'Group Discounts', 'Photography Tips', 'Temple Protocols', 'Local Connections'],
            specialty: 'Cultural Heritage',
            languages: ['English', 'Sinhala', 'Tamil'],
            experience: '8 years',
            certifications: [
                'Licensed Tour Guide (SLTDA)',
                'Cultural Heritage Specialist',
                'First Aid Certified',
                'Buddhist Philosophy Certificate'
            ],
            tourTypes: [
                { name: 'Temple Tours', duration: '3-4 hours', price: 35 },
                { name: 'Historical Sites', duration: '4-6 hours', price: 35 },
                { name: 'Cultural Experiences', duration: '2-8 hours', price: 35 },
                { name: 'Photography Tours', duration: '4-5 hours', price: 40 }
            ],
            specializations: [
                'Temple of the Tooth',
                'Royal Palace Complex',
                'Traditional Kandyan Dance',
                'Buddhist Monasteries',
                'Colonial Architecture',
                'Spice Gardens'
            ],
            policies: [
                'Free consultation before booking',
                'Customizable itineraries available',
                'Group rates for 4+ people (10% discount)',
                'Flexible start times',
                'Weather contingency plans included'
            ],
            availability_schedule: {
                monday: 'Available 8 AM - 6 PM',
                tuesday: 'Available 8 AM - 6 PM',
                wednesday: 'Available 8 AM - 6 PM',
                thursday: 'Available 8 AM - 6 PM',
                friday: 'Available 8 AM - 6 PM',
                saturday: 'Available 8 AM - 8 PM',
                sunday: 'Available 9 AM - 5 PM'
            },
            awards: [
                'Best Cultural Guide 2023 - Sri Lanka Tourism',
                'Excellence in Service Award 2022',
                'Cultural Ambassador Recognition'
            ],
            userReviews: [
                {
                    id: 1,
                    name: 'David Brown',
                    rating: 4.8,
                    review: 'Pradeep was absolutely fantastic! His knowledge of Sri Lankan history and culture is incredible. He took us to the Temple of the Tooth and explained the significance of every ritual. His English is perfect and he\'s very patient with questions. Highly recommend!',
                    profileImage: 'https://randomuser.me/api/portraits/men/5.jpg',
                    date: '2024-01-14',
                    helpful: 28,
                    tour: 'Temple & Heritage Tour'
                },
                {
                    id: 2,
                    name: 'Emma Davis',
                    rating: 4.6,
                    review: 'Great guide with excellent communication skills. Pradeep made our temple visits truly memorable with his storytelling. He also gave us great photography tips and knew the best angles for photos.',
                    profileImage: 'https://randomuser.me/api/portraits/women/6.jpg',
                    date: '2024-01-09',
                    helpful: 22,
                    tour: 'Photography Cultural Tour'
                },
                {
                    id: 3,
                    name: 'Robert Wilson',
                    rating: 4.9,
                    review: 'Outstanding experience! Pradeep\'s passion for his culture is infectious. He arranged for us to meet local artisans and even got us invited to a traditional ceremony. This was much more than just a tour!',
                    profileImage: 'https://randomuser.me/api/portraits/men/7.jpg',
                    date: '2024-01-06',
                    helpful: 35,
                    tour: 'Cultural Immersion Experience'
                }
            ]
        },
        {
            id: 13,
            name: 'Wildlife Safari Guide',
            guideName: 'Roshan Perera',
            provider: 'Safari Experts',
            location: 'Yala National Park, Sri Lanka',
            rating: 4.9,
            reviews: 156,
            price: 50,
            priceUnit: 'day',
            images: [
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800',
                'https://images.unsplash.com/photo-1534567110043-f0d3629bd92b?w=800'
            ],
            features: ['Wildlife Expert', 'Photography Tips', 'Conservation Knowledge', 'Early Bird Tours'],
            availability: 'Available',
            description: 'Experienced wildlife guide specializing in Sri Lankan fauna with 12 years of field experience.',
            amenities: ['Wildlife Expertise', 'Photography Guidance', 'Conservation Education', 'Equipment Provided'],
            specialty: 'Wildlife Safari',
            languages: ['English', 'German'],
            experience: '12 years',
            certifications: ['Wildlife Guide License', 'Conservation Certificate'],
            userReviews: [
                {
                    id: 1,
                    name: 'Lisa Chen',
                    rating: 4.9,
                    review: 'Amazing wildlife guide! Roshan spotted animals we would never have seen on our own. His knowledge of animal behavior is incredible.',
                    profileImage: 'https://randomuser.me/api/portraits/women/8.jpg',
                    date: '2024-01-11',
                    helpful: 19,
                    tour: 'Full Day Safari'
                }
            ]
        }
    ];

    // Debug: Log the guide selection process
    console.log('👨‍🏫 [DEBUG] Starting TourGuideDetails component...');
    console.log('👨‍🏫 [DEBUG] Guide ID from params:', id);
    console.log('👨‍🏫 [DEBUG] Location state:', location.state);
    console.log('👨‍🏫 [DEBUG] Available mock guides:', mockTourGuides.length);
    console.log('👨‍🏫 [DEBUG] Looking for guide with ID:', parseInt(id));
    
    const guide = mockTourGuides.find(g => g.id === parseInt(id)) || mockTourGuides[0];
    
    console.log('👨‍🏫 [DEBUG] Selected guide:', guide);
    console.log('👨‍🏫 [DEBUG] Guide details:');
    if (guide) {
        console.log('  - ID:', guide.id);
        console.log('  - Name:', guide.guideName);
        console.log('  - Provider:', guide.provider);
        console.log('  - Location:', guide.location);
        console.log('  - Rating:', guide.rating);
        console.log('  - Price:', guide.price);
        console.log('  - Price Unit:', guide.priceUnit);
        console.log('  - Specialty:', guide.specialty);
        console.log('  - Languages:', guide.languages);
        console.log('  - Experience:', guide.experience);
        console.log('  - Images count:', guide.images?.length || 0);
        console.log('  - Features:', guide.features);
        console.log('  - Availability:', guide.availability);
        console.log('  - Description:', guide.description?.substring(0, 100) + '...');
        console.log('  - Full guide object:', guide);
    }

    // Check if user came from trip planning page
    const isFromTripPlanning = location.state?.fromTripPlanning === true;
    console.log('👨‍🏫 [DEBUG] Is from trip planning:', isFromTripPlanning);

    // Set default dates when coming from trip planning
    useEffect(() => {
        if (isFromTripPlanning && location.state?.selectedDateValue) {
            const selectedDate = location.state.selectedDateValue; // This is the specific date user clicked
            
            setBookingData(prev => ({
                ...prev,
                tourDate: selectedDate
            }));
        }
    }, [isFromTripPlanning, location.state]);

    const handlePrevImage = () => {
        setCurrentImage(prev => prev === 0 ? guide.images.length - 1 : prev - 1);
    };

    const handleNextImage = () => {
        setCurrentImage(prev => prev === guide.images.length - 1 ? 0 : prev + 1);
    };

    const handleBookingSubmit = () => {
        if (isFromTripPlanning) {
            // Add to trip planning summary
            const planningBooking = {
                id: `guide_${guide.id}_${Date.now()}`,
                serviceId: guide.id,
                name: guide.name,
                location: guide.location,
                type: 'guide',
                tourDate: bookingData.tourDate,
                duration: bookingData.duration,
                groupSize: bookingData.groupSize,
                pricePerHour: guide.price,
                totalPrice: calculateTotal(),
                image: guide.images[0],
                specialties: guide.specialties,
                languages: guide.languages,
                selectedDate: location.state?.selectedDateValue || bookingData.tourDate // Store the specific selected date
            };
            
            addToTripPlanning(planningBooking, 'guides');
            
            console.log('✅ Guide added to trip planning:', planningBooking);
            
            // Show success popup and let user navigate back manually
            alert('✅ Guide added to your itinerary successfully! You can now go back to the planning page to view your summary.');
        } else {
            // Navigate to payment page for direct booking
            const directBooking = {
                id: `guide_${guide.id}_${Date.now()}`,
                serviceId: guide.id,
                name: guide.name,
                location: guide.location,
                type: 'guide',
                tourDate: bookingData.tourDate,
                duration: bookingData.duration,
                groupSize: bookingData.groupSize,
                pricePerHour: guide.price,
                totalPrice: calculateTotal(),
                image: guide.images[0],
                specialties: guide.specialties,
                languages: guide.languages
            };
            
            // Store booking data in localStorage for payment page
            localStorage.setItem('directBookingData', JSON.stringify([directBooking]));
            navigate('/user/individual-booking-payment');
        }
    };

    const calculateTotal = () => {
        const basePrice = guide.price * bookingData.duration;
        const serviceFee = 12;
        const groupDiscount = bookingData.groupSize >= 4 ? Math.round(basePrice * 0.1) : 0;
        return basePrice + serviceFee - groupDiscount;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(-1)}
                            className="flex items-center"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {isFromTripPlanning ? 'Back to Planning' : 'Back to Tour Guides'}
                        </Button>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="flex items-center">
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center">
                                <Heart className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <Breadcrumb 
                        items={isFromTripPlanning ? [
                            { label: 'Dashboard', path: '/user/dashboard', isHome: true },
                            { label: 'Trip Planning', path: '/user/trip-planning' },
                            { label: guide.guideName, isActive: true }
                        ] : [
                            { label: 'Dashboard', path: '/user/dashboard', isHome: true },
                            { label: 'Services'},
                            { label: 'Tour Guides', path: '/user/tour-guides' },
                            { label: guide.guideName, isActive: true }
                        ]} 
                    />
                </div>
            </div>

            {/* Image Gallery */}
            <div className="relative h-96 overflow-hidden">
                <img
                    src={guide.images[currentImage]}
                    alt={guide.guideName}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                
                {/* Image Navigation */}
                {guide.images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 transition-all"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 transition-all"
                        >
                            <ArrowLeft className="w-6 h-6 rotate-180" />
                        </button>
                        
                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {guide.images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImage(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${
                                        currentImage === index 
                                            ? 'bg-white' 
                                            : 'bg-white bg-opacity-50'
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Info */}
                        <Card className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{guide.name}</h1>
                                    <h2 className="text-xl font-semibold text-blue-600 mb-2">Guide: {guide.guideName}</h2>
                                    <div className="flex items-center text-slate-600 mb-2">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{guide.location}</span>
                                    </div>
                                    <p className="text-slate-500">by {guide.provider}</p>
                                    <div className="flex items-center mt-2 space-x-4">
                                        <div className="flex items-center">
                                            <Award className="w-4 h-4 mr-2 text-blue-500" />
                                            <span className="text-sm font-medium text-slate-700">{guide.experience} experience</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Camera className="w-4 h-4 mr-2 text-blue-500" />
                                            <span className="text-sm font-medium text-slate-700">{guide.specialty}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-semibold text-slate-800">{guide.rating}</span>
                                    <span className="text-slate-500">({guide.reviews} reviews)</span>
                                </div>
                            </div>
                            
                            <div className="text-3xl font-bold text-blue-600 mb-4">
                                ${guide.price}
                                <span className="text-lg font-normal text-slate-500">/hour</span>
                            </div>
                        </Card>

                        {/* About the Guide */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">About {guide.guideName}</h2>
                            <p className="text-slate-600 leading-relaxed">{guide.description}</p>
                        </Card>

                        {/* Languages & Certifications */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Qualifications</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                                        <Languages className="w-5 h-5 mr-2 text-blue-500" />
                                        Languages Spoken
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {guide.languages.map((language, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full border border-green-200"
                                            >
                                                {language}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                                        <Award className="w-5 h-5 mr-2 text-blue-500" />
                                        Certifications
                                    </h3>
                                    <div className="space-y-2">
                                        {guide.certifications.map((cert, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-sm text-slate-700">{cert}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Tour Types */}
                        {guide.tourTypes && (
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">Available Tours</h2>
                                <div className="space-y-4">
                                    {guide.tourTypes.map((tour, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-slate-800">{tour.name}</h3>
                                                <p className="text-sm text-slate-600">Duration: {tour.duration}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-blue-600">${tour.price}/hour</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Specializations */}
                        {guide.specializations && (
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">Areas of Expertise</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {guide.specializations.map((specialization, index) => (
                                        <div key={index} className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                                            <Camera className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm text-slate-700">{specialization}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Awards */}
                        {guide.awards && (
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">Recognition & Awards</h2>
                                <div className="space-y-3">
                                    {guide.awards.map((award, index) => (
                                        <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                                            <Award className="w-5 h-5 text-yellow-600" />
                                            <span className="text-slate-800 font-medium">{award}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* What's Included */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">What's Included</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {guide.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-slate-700">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Policies */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Booking Policies</h2>
                            <div className="space-y-3">
                                {guide.policies.map((policy, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-slate-700">{policy}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Reviews */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Guest Reviews</h2>
                            <div className="space-y-6">
                                {guide.userReviews.map((review) => (
                                    <div key={review.id} className="border-b border-slate-200 pb-6 last:border-b-0">
                                        <div className="flex items-start space-x-4">
                                            <img
                                                src={review.profileImage}
                                                alt={review.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-semibold text-slate-800">{review.name}</h4>
                                                        {review.tour && (
                                                            <p className="text-xs text-blue-600">{review.tour}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                        <span className="text-sm text-slate-600">{review.rating}</span>
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 mb-3">{review.review}</p>
                                                <div className="flex items-center justify-between text-sm text-slate-400">
                                                    <span>{review.date}</span>
                                                    <span>{review.helpful} people found this helpful</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" className="mt-4">
                                    See all {guide.reviews} reviews
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Booking Card */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Book {guide.guideName}</h3>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Tour Date
                                        </label>
                                        <Input
                                            type="date"
                                            value={bookingData.tourDate}
                                            onChange={(e) => setBookingData(prev => ({ ...prev, tourDate: e.target.value }))}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Duration (hours)
                                        </label>
                                        <select 
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={bookingData.duration}
                                            onChange={(e) => setBookingData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                                        >
                                            <option value={2}>2 hours</option>
                                            <option value={4}>4 hours (Half day)</option>
                                            <option value={6}>6 hours</option>
                                            <option value={8}>8 hours (Full day)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Tour Type
                                        </label>
                                        <select 
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={bookingData.tourType}
                                            onChange={(e) => setBookingData(prev => ({ ...prev, tourType: e.target.value }))}
                                        >
                                            <option value="cultural">Cultural Heritage</option>
                                            <option value="temples">Temple Tour</option>
                                            <option value="historical">Historical Sites</option>
                                            <option value="photography">Photography Tour</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Special Requests (Optional)
                                        </label>
                                        <textarea 
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                            rows="3"
                                            placeholder="Any specific interests or requirements..."
                                            value={bookingData.specialRequests}
                                            onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">Group Size</span>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => setBookingData(prev => ({ 
                                                    ...prev, 
                                                    groupSize: Math.max(1, prev.groupSize - 1) 
                                                }))}
                                                className="p-1 rounded-full border border-slate-300 hover:bg-slate-50"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="font-semibold w-8 text-center">{bookingData.groupSize}</span>
                                            <button
                                                onClick={() => setBookingData(prev => ({ 
                                                    ...prev, 
                                                    groupSize: prev.groupSize + 1 
                                                }))}
                                                className="p-1 rounded-full border border-slate-300 hover:bg-slate-50"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {bookingData.groupSize >= 4 && (
                                        <p className="text-xs text-green-600">🎉 Group discount applied!</p>
                                    )}
                                </div>

                                {/* Price Breakdown */}
                                <div className="border-t border-slate-200 pt-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">
                                                ${guide.price} x {bookingData.duration} hours
                                            </span>
                                            <span className="text-slate-800">
                                                ${guide.price * bookingData.duration}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Service fee</span>
                                            <span className="text-slate-800">$12</span>
                                        </div>
                                        {bookingData.groupSize >= 4 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Group discount (10%)</span>
                                                <span className="text-green-600">-${Math.round(guide.price * bookingData.duration * 0.1)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200">
                                        <span>Total</span>
                                        <span className="text-blue-600">${calculateTotal()}</span>
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                    onClick={handleBookingSubmit}
                                    disabled={!bookingData.tourDate}
                                >
                                    {isFromTripPlanning ? 'Add to Itinerary' : 'Proceed to Payment'}
                                </Button>
                                
                                <p className="text-xs text-slate-500 text-center">
                                    {isFromTripPlanning 
                                        ? 'Add tour guide to your trip itinerary' 
                                        : 'Complete booking and payment'
                                    }
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <TravelerFooter />

            {/* Payment Modal */}
            <PaymentModal 
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                bookingData={guide}
                totalAmount={calculateTotal()}
            />
        </div>
    );
};

export default TourGuideDetails;