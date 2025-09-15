import { useState , useEffect } from 'react';
import { Calendar, MapPin, Plane, Camera, Heart, Star, Clock, Users } from 'lucide-react';

const TravelerDashboard = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('');

    const inspiringQuotes = [
        "The world is a book, and those who do not travel read only one page. - Augustine",
        "Travel makes one modest. You see what a tiny place you occupy in the world. - Gustave Flaubert",
        "Adventure is worthwhile in itself. - Amelia Earhart",
        "To travel is to live. - Hans Christian Andersen",
        "Life is short and the world is wide. - Simon Raven",
        "Not all those who wander are lost. - J.R.R. Tolkien",
        "Travel far enough, you meet yourself. - David Mitchell",
        "Wherever you go becomes a part of you somehow. - Anita Desai",
        "The journey, not the arrival, matters. - T.S. Eliot",
        "Traveling – it leaves you speechless, then turns you into a storyteller. - Ibn Battuta",
        "Blessed are the curious for they shall have adventures. - Lovelle Drachman",
        "Once a year, go someplace you’ve never been before. - Dalai Lama"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true); // true = visible, false = fade out

    useEffect(() => {
        const interval = setInterval(() => {
        setFade(false); // start fade out
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % inspiringQuotes.length); // next quote
            setFade(true);
        }, 1000); // match transition duration
        }, 20000); 

        return () => clearInterval(interval);
    }, []); 

    const [quoteText, quoteAuthor] = inspiringQuotes[currentIndex].split(" - ");


    return(
            //Header Of the Dashbord
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center text-center gap-4">
                    <h1
                        className={`text-3xl font-bold mb-2 text-white transition-opacity duration-500 ${
                        fade ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        {quoteText}
                    </h1>
                    <p
                        className={`text-lg text-slate-300 mb-4 transition-opacity duration-500 ${
                        fade ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        - {quoteAuthor}
                    </p>
                    </div>
                </div>
            </div>
        </div>

            //Rest
        )
    };

    export default TravelerDashboard;