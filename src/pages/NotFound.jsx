import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Mountain, MapPin, Camera } from 'lucide-react';
import { Button } from '../components';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Large gradient circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-32 left-1/4 w-64 h-64 bg-gradient-to-r from-slate-200/30 to-gray-200/30 rounded-full mix-blend-multiply filter blur-xl"></div>
        
        {/* Small floating elements */}
        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-teal-400 rounded-full animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative flex items-center justify-center p-4 min-h-screen">
        <div className="max-w-2xl w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6">
              {/* 404 with Mountain Icon */}
              <div className="relative">
                <h1 className="text-8xl md:text-9xl font-bold text-slate-200 leading-none">404</h1>
                <div className="absolute inset-0 flex items-center justify-center lg:justify-start">
                  <Mountain className="w-16 h-16 md:w-20 md:h-20 text-emerald-500" />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2 -mt-4">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Page Not Found</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto lg:mx-0"></div>
              </div>

              {/* Description */}
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Oops! It seems like you've wandered off the beaten path while exploring our digital Sri Lanka. 
                Let's get you back to discovering paradise!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-4">
                <button 
                  onClick={() => navigate(-1)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Go Back
                </button>
                
                <Link to="/">
                  <button className="bg-white/70 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:text-slate-800 py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 w-full">
                    <Home className="w-5 h-5" />
                    Go Home
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Content - Illustration */}
            <div className="text-center">
              <div className="relative mx-auto w-72 h-72 md:w-80 md:h-80">
                {/* Main circle with glassmorphism */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-transform duration-500">
                    <Mountain className="w-16 h-16 text-white" />
                  </div>
                </div>

                {/* Floating elements around */}
                <div className="absolute top-12 left-12 w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-80 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="absolute bottom-16 right-12 w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-70 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="absolute top-20 right-16 w-8 h-8 bg-gradient-to-r from-slate-400 to-gray-500 rounded-full opacity-60"></div>
                <div className="absolute bottom-20 left-20 w-6 h-6 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full opacity-50"></div>
              </div>

              {/* Bottom text */}
              <div className="mt-6 space-y-2">
                <h3 className="text-xl font-semibold text-slate-700">Lost in Paradise?</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  Even the best adventurers sometimes take unexpected detours while exploring Sri Lanka's digital wonders.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-400">
              © 2025 WanderLanka - Your Gateway to Sri Lanka
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
