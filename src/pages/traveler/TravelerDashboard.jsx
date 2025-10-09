import { useState, useEffect } from 'react';
import { Calendar, MapPin, Plane, Camera, Heart, Star, Clock, Users, Search, ArrowRight, Hotel, Car, Utensils, Plus, Zap } from 'lucide-react';
import { Button, Card, Input } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';

const TravelerDashboard = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('');

    const images = [
        'https://plus.unsplash.com/premium_photo-1666254114402-cd16bc302aea?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1580910527739-556eb89f9d65?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1666254114402-cd16bc302aea?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1507296993015-167a20c29988?q=80&w=1333&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1534353739409-c61daeb03f61?q=80&w=1333&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ];

    // Get current date and user info
    const currentDate = new Date();

    // Mock data for upcoming trip
    const upcomingTrip = {
        destination: "Sigiriya, Sri Lanka",
        image: "/api/placeholder/600/300",
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-22'),
        hotel: "Heritance Kandalama",
        people: 2,
        tripId: "TRP-001"
    };

    // Calculate days until trip
    const daysUntilTrip = Math.ceil((upcomingTrip.startDate - currentDate) / (1000 * 60 * 60 * 24));

    // Mock bookings data
    const bookings = [
        { 
            id: 1, 
            type: 'flight', 
            title: 'Flight to Colombo',
            date: '2024-01-15',
            status: 'confirmed',
            icon: Plane,
            details: 'SriLankan Airlines - UL 504'
        },
        { 
            id: 2, 
            type: 'hotel', 
            title: 'Heritance Kandalama',
            date: '2024-01-15',
            status: 'confirmed',
            icon: Hotel,
            details: '7 nights - Deluxe Room'
        },
        { 
            id: 3, 
            type: 'experience', 
            title: 'Sigiriya Rock Climbing',
            date: '2024-01-16',
            status: 'pending',
            icon: Camera,
            details: 'Morning tour with guide'
        }
    ];

    // Mock recommendations data
    const recommendations = [
        {
            id: 1,
            destination: "Maldives",
            image: "/api/placeholder/400/300",
            price: "$1,299",
            originalPrice: "$1,599",
            discount: "20% OFF",
            rating: 4.9,
            description: "Luxury resort with overwater villas"
        },
        {
            id: 2,
            destination: "Bali, Indonesia",
            image: "/api/placeholder/400/300",
            price: "$899",
            originalPrice: "$1,199",
            discount: "25% OFF",
            rating: 4.7,
            description: "Cultural temples and rice terraces"
        },
        {
            id: 3,
            destination: "Kyoto, Japan",
            image: "/api/placeholder/400/300",
            price: "$1,499",
            originalPrice: "$1,799",
            discount: "15% OFF",
            rating: 4.8,
            description: "Ancient temples and cherry blossoms"
        }
    ];

    const inspiringQuotes = [
        "The world is a book, and those who do not travel read only one page. - Augustine",
        "Travel makes one modest. You see what a tiny place you occupy in the world. - Gustave Flaubert",
        "Adventure is worthwhile in itself. - Amelia Earhart",
        "To travel is to live. - Hans Christian Andersen",
        "Life is short and the world is wide. - Simon Raven",
        "Not all those who wander are lost. - J.R.R. Tolkien"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % inspiringQuotes.length);
                setFade(true);
            }, 500);
        }, 8000); 

        return () => clearInterval(interval);
    }, [inspiringQuotes.length]); 
    const [quoteText, quoteAuthor] = inspiringQuotes[currentIndex].split(" - ");

    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000); // 5000ms = 5 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    const handlePlanTrip = (e) => {
        e.preventDefault();
        console.log('Planning trip to:', selectedDestination, 'from', startDate, 'to', endDate);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Plan a Trip Section */}
            <div className="relative overflow-hidden">
                 {images.map((img, index) => (
                    <div
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                        index === currentImage ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ backgroundImage: `url(${img})` }}
                    />
                ))}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-800/50 to-slate-900/70"></div>
                
                <div className="relative max-w-7xl mx-auto px-6 py-12">
                    <div className="text-center mb-4">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                            Plan Your Next Adventure
                        </h2>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            Discover amazing destinations and create unforgettable memories
                        </p>
                    </div>

                    <form onSubmit={handlePlanTrip} className="max-w-4xl mx-auto flex flex-col items-center mb-2">
                        <div className="flex flex-col md:flex-row gap-4 mb-3">
                            <div className="relative flex-1">
                                
                                <div className="relative p-4">
                                    <label className="block text-white/90 text-sm font-medium mb-2">
                                        <MapPin className="inline w-4 h-4 mr-2" />
                                        Destination
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedDestination}
                                        onChange={(e) => setSelectedDestination(e.target.value)}
                                        placeholder="Where do you want to go?"
                                        className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-xl text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-white/50 focus:outline-none transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div className="relative flex-1">
                                <div className="relative p-4">
                                    <label className="block text-white/90 text-sm font-medium mb-2">
                                        <Calendar className="inline w-4 h-4 mr-2" />
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-xl text-slate-800 focus:ring-2 focus:ring-white/50 focus:outline-none transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div className="relative flex-1">
                                <div className="relative p-4">
                                    <label className="block text-white/90 text-sm font-medium mb-2">
                                        <Calendar className="inline w-4 h-4 mr-2" />
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-xl text-slate-800 focus:ring-2 focus:ring-white/50 focus:outline-none transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>
                        <Button 
                            type="submit" 
                            variant="primary"
                            className="group"
                        >
                            <span className="flex items-center">
                                <Search className="w-5 h-5 mr-2" />
                                Plan My Trip
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                            </span>
                        </Button>
                    </form>

                    <div className="relative overflow-hidden">
                        <div className="relative max-w-4xl mx-auto px-6 py-8 text-center">
                            <div className="max-w-4xl mx-auto">
                                <h1
                                    className={`text-xl md:text-2xl lg:text-2xl font-bold text-white mb-4 leading-tight transition-all duration-500 transform ${
                                        fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                    }`}
                                >
                                    {quoteText}
                                </h1>
                                <p
                                    className={`text-lg md:text-m text-slate-300 transition-all duration-500 transform ${
                                        fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                    }`}
                                >
                                    - {quoteAuthor}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

               

            </div>
           
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"> {/* Change the width of the contianer here (7xl)*/}

                {/* Grid Layout for Upcoming Trip and Bookings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upcoming Trip Section */}
                    <Card 
                        className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-white"
                        hover={true}
                        padding="large"
                    >
                        <div className="absolute inset-0 bg-[url('/api/placeholder/600/400')] opacity-30 bg-cover bg-center"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        <div className="relative h-64 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold">Upcoming Trip</h3>
                                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                                        {daysUntilTrip > 0 ? `${daysUntilTrip} days to go` : 'Trip started!'}
                                    </div>
                                </div>
                                <h4 className="text-3xl font-bold mb-2">{upcomingTrip.destination}</h4>
                                <p className="text-white/90 mb-4">{upcomingTrip.hotel}</p>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center text-white/90">
                                    <Calendar className="w-5 h-5 mr-3" />
                                    <span>{upcomingTrip.startDate.toLocaleDateString()} - {upcomingTrip.endDate.toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center text-white/90">
                                    <Users className="w-5 h-5 mr-3" />
                                    <span>{upcomingTrip.people} travelers</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/90">Trip ID: {upcomingTrip.tripId}</span>
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-none"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Bookings Snapshot */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">Your Bookings</h3>
                        {bookings.map((booking) => {
                            const Icon = booking.icon;
                            return (
                                <Card
                                    key={booking.id}
                                    className="bg-white/80 backdrop-blur-sm border border-white/20 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    hover={true}
                                    padding="default"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4">
                                            <div className={`p-3 rounded-xl ${
                                                booking.type === 'flight' ? 'bg-blue-100 text-blue-600' :
                                                booking.type === 'hotel' ? 'bg-green-100 text-green-600' :
                                                'bg-purple-100 text-purple-600'
                                            }`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-slate-800">{booking.title}</h4>
                                                <p className="text-slate-600 mb-1">{booking.details}</p>
                                                <p className="text-sm text-slate-500">{new Date(booking.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            booking.status === 'confirmed' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Recommendations Section */}
                <div className="mt-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                            Recommended Destinations
                        </h2>
                        <p className="text-xl text-slate-600">
                            Handpicked destinations just for you
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recommendations.map((destination) => (
                            <Card
                                key={destination.id}
                                className="group overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                                hover={true}
                                padding="none"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={destination.image}
                                        alt={destination.destination}
                                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                            {destination.discount}
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-sm font-medium">{destination.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{destination.destination}</h3>
                                    <p className="text-slate-600 mb-4">{destination.description}</p>
                                    
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl font-bold text-slate-800">{destination.price}</span>
                                            <span className="text-lg text-slate-500 line-through">{destination.originalPrice}</span>
                                        </div>
                                    </div>

                                    <Button 
                                        variant="primary"
                                        size="lg"
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        <span className="flex items-center justify-center">
                                            <Zap className="w-5 h-5 mr-2" />
                                            Book Now
                                        </span>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
            <TravelerFooter />
        </div>
    );
};

export default TravelerDashboard;