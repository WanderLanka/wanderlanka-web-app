import React from 'react';
import { Star, ChevronRight, Plane, Mountain, Waves, Sun } from 'lucide-react';
import { Button } from '../common';

const HeroSection = ({ sriLankanDestinations, onStartJourney }) => {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in-up">
            
            <h1 className="text-5xl lg:text-8xl font-bold text-gray-900 leading-tight animate-slide-in-left">
              Discover
              <span className="block bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 bg-clip-text text-transparent animate-gradient-shift">
                Sri Lanka
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-xl animate-fade-in-up animation-delay-300">
              From ancient temples to pristine beaches, tea plantations to wildlife safaris - experience the Pearl of the Indian Ocean like never before.
            </p>
            
            {/* Destination Tags */}
            <div className="flex flex-wrap gap-2 animate-fade-in-up animation-delay-500">
              {sriLankanDestinations.slice(0, 4).map((dest, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full text-sm font-medium border border-green-100 shadow-sm hover:scale-105 hover:shadow-md transition-all duration-300 animate-bounce-in"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  {dest}
                </span>
              ))}
              <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-medium shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 animate-pulse-soft">
                +200 more
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onStartJourney} 
                variant="primary"
                size="lg"
                className="group bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-2xl px-10 py-5 text-lg font-bold rounded-2xl"
              >
                Start Your Journey
              </Button>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-green-200/50">
              <div className="text-center group">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">22</div>
                <div className="text-gray-600 font-medium">UNESCO Sites</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">100K+</div>
                <div className="text-gray-600 font-medium">Happy Visitors</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">4.9</div>
                <div className="text-gray-600 font-medium">★ Rating</div>
              </div>
            </div>
          </div>

          {/* Enhanced Hero Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-500 rounded-3xl transform rotate-3 opacity-20 blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl transform -rotate-2 opacity-15"></div>
            
            <img 
              src="https://images.unsplash.com/photo-1558791985-4241e4011215?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Wilpaththuwa Sri Lanka" 
              className="relative z-10 w-full h-96 lg:h-[600px] object-cover rounded-3xl shadow-2xl"
            />
            
            {/* Floating Information Cards */}
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl animate-bounce">
              <div className="flex items-center space-x-3">
                <Mountain className="w-6 h-6 text-green-500" />
                <div>
                  <div className="font-bold text-gray-800">Sigiriya</div>
                  <div className="text-sm text-gray-600">Ancient Rock Fortress</div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <Waves className="w-6 h-6 text-blue-500" />
                <div>
                  <div className="font-bold text-gray-800">Galle Fort</div>
                  <div className="text-sm text-gray-600">Dutch Colonial Heritage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
