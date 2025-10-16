import React from 'react';
import { Mountain, Heart, TreePine, Waves, Camera, Sun } from 'lucide-react';

const DestinationsSection = () => {
  const destinations = [
    {
      image: "https://images.unsplash.com/photo-1580794749460-76f97b7180d8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Sigiriya Rock Fortress",
      description: "Climb the ancient Lion Rock and discover 5th-century frescoes",
      category: "Historical",
      icon: Mountain,
      gradient: "from-orange-500 to-red-600"
    },
    {
      image: "https://images.unsplash.com/photo-1707324021005-a3d0c48cfcbd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Kandy Temple of Tooth",
      description: "Sacred Buddhist temple housing Buddha's tooth relic",
      category: "Spiritual",
      icon: Heart,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      image: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Ella Nine Arches Bridge",
      description: "Iconic railway bridge surrounded by lush tea plantations",
      category: "Scenic",
      icon: TreePine,
      gradient: "from-green-500 to-teal-600"
    },
    {
      image: "https://images.unsplash.com/flagged/photo-1567498573339-688686a4b5df?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Galle Dutch Fort",
      description: "Colonial architecture meets Indian Ocean coastline",
      category: "Heritage",
      icon: Waves,
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      image: "https://plus.unsplash.com/premium_photo-1661832611972-b6ee1aba3581?q=80&w=1375&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Yala National Park",
      description: "Spot leopards, elephants and diverse wildlife",
      category: "Wildlife",
      icon: Camera,
      gradient: "from-amber-500 to-orange-600"
    },
    {
      image: "https://plus.unsplash.com/premium_photo-1692049123825-8d43174c9c5c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Nuwara Eliya Tea Country",
      description: "Rolling hills of Ceylon tea plantations",
      category: "Nature",
      icon: Sun,
      gradient: "from-emerald-500 to-green-600"
    }
  ];

  return (
    <section id="destinations" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 opacity-0 animate-fade-in-up">
            Iconic <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent animate-gradient-shift">Destinations</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in-up animation-delay-300">
            Explore Sri Lanka's most breathtaking locations, from ancient wonders to natural paradises
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 opacity-0 animate-fade-in-up"
              style={{
                animationDelay: `${600 + (index * 150)}ms`
              }}
            >
              <img 
                src={destination.image} 
                alt={destination.title}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute top-4 right-4 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                <div className={`w-12 h-12 bg-gradient-to-r ${destination.gradient} rounded-2xl flex items-center justify-center shadow-lg animate-pulse-soft`}>
                  <destination.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-3 transform scale-95 group-hover:scale-100 transition-transform duration-200">
                  {destination.category}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 transform translate-x-[-10px] group-hover:translate-x-0 transition-transform duration-300">{destination.title}</h3>
                <p className="text-gray-200 leading-relaxed text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">{destination.description}</p>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
