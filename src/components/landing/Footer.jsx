import React from 'react';
import { Mountain, Globe, MapPin } from 'lucide-react';
import { Button } from '../common';

const Footer = ({ onStartJourney }) => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6 opacity-0 animate-slide-in-left">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center animate-pulse-soft hover:scale-110 transition-transform duration-300">
                <Mountain className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="font-bold text-2xl bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent animate-gradient-shift">
                 WanderLanka
                </span>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed max-w-md text-lg transform translate-y-4 opacity-0 animate-fade-in-up animation-delay-300">
              Discover the magic of Sri Lanka with authentic experiences, expert local guides, and unforgettable memories that last a lifetime.
            </p>
            
            <div className="flex space-x-6 opacity-0 animate-fade-in-up animation-delay-500">
              {['Facebook', 'Instagram', 'Twitter', 'YouTube'].map((social, index) => (
                <a 
                  key={social} 
                  href="#" 
                  className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-green-500 transition-all duration-300 group hover:scale-110"
                  style={{
                    animationDelay: `${700 + (index * 100)}ms`
                  }}
                >
                  <Globe className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="opacity-0 animate-slide-in-right animation-delay-300">
            <h3 className="font-bold text-xl mb-6 text-green-400 transform hover:translate-x-1 transition-transform duration-200">Explore</h3>
            <ul className="space-y-4">
              {['Destinations', 'Experiences', 'Culture', 'Wildlife', 'Adventure Tours', 'Luxury Stays'].map((item, index) => (
                <li 
                  key={item}
                  className="opacity-0 animate-fade-in-up"
                  style={{
                    animationDelay: `${600 + (index * 100)}ms`
                  }}
                >
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-all duration-300 font-medium hover:translate-x-2 transform inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="opacity-0 animate-slide-in-right animation-delay-500">
            <h3 className="font-bold text-xl mb-6 text-green-400 transform hover:translate-x-1 transition-transform duration-200">Connect</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 opacity-0 animate-fade-in-up animation-delay-700 hover:translate-x-1 transition-transform duration-200">
                <MapPin className="w-5 h-5 text-green-400 flex-shrink-0 animate-pulse-soft" />
                <span className="text-gray-300">Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center space-x-3 opacity-0 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                <Globe className="w-5 h-5 text-green-400 flex-shrink-0 animate-pulse-soft" />
                <span className="text-gray-300 hover:text-green-400 transition-colors duration-200">info@wanderlanka.com</span>
              </li>
              <li className="opacity-0 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
                <Button 
                  onClick={onStartJourney} 
                  variant="ghost"
                  className="text-green-400 hover:text-green-300 font-semibold transition-all duration-300 hover:translate-x-2 transform p-0"
                >
                  Start Your Journey →
                </Button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 opacity-0 animate-fade-in-up animation-delay-700">
          <div className="text-gray-400 text-center md:text-left transform hover:translate-x-1 transition-transform duration-200">
            © 2025 WanderLanka. Crafted with ❤️ for Sri Lanka lovers worldwide.
          </div>
          <div className="flex space-x-8 text-sm">
            {['Privacy Policy', 'Terms of Service', 'Contact'].map((item, index) => (
              <a 
                key={item}
                href="#" 
                className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-y-[-2px] transform inline-block"
                style={{
                  animationDelay: `${800 + (index * 100)}ms`
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
