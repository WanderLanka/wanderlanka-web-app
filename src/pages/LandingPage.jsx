import React, { useState } from 'react';
// Import components
import Navbar from '../components/landing/Navbar';
import AuthModal from '../components/landing/AuthModal';
import HeroSection from '../components/landing/HeroSection';
import DestinationsSection from '../components/landing/DestinationsSection';
import ExperiencesSection from '../components/landing/ExperiencesSection';
import CultureSection from '../components/landing/CultureSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import PlanningSection from '../components/landing/PlanningSection';
import Footer from '../components/landing/Footer';
import BackgroundElements from '../components/landing/BackgroundElements';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const sriLankanDestinations = [
    "Sigiriya", "Kandy", "Galle", "Ella", "Nuwara Eliya", "Anuradhapura", "Polonnaruwa", "Yala",
    "Arugam Bay", "Mirissa", "Hikkaduwa", "Bentota", "Trincomalee", "Dambulla", "Horton Plains"
  ];

  const handleStartJourney = () => setShowSignup(true);
  const handleAuthToggle = () => {
    setShowLogin(!showLogin);
    setShowSignup(!showSignup);
  };

  return (
    <div className="landing-page min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative">
      <BackgroundElements />
      
      <Navbar 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setShowLogin={setShowLogin}
        setShowSignup={setShowSignup}
      />

      {showLogin && (
        <AuthModal 
          isLogin={true} 
          onClose={() => setShowLogin(false)}
          onToggleMode={handleAuthToggle}
        />
      )}

        {showSignup && (
            <AuthModal 
            isLogin={false} 
            onClose={() => setShowSignup(false)}
            onToggleMode={handleAuthToggle}
            />
        )}

        <HeroSection 
            sriLankanDestinations={sriLankanDestinations}
            onStartJourney={handleStartJourney}
        />

        <DestinationsSection />

        <ExperiencesSection />

        <CultureSection />

        <TestimonialsSection />      
        
        <PlanningSection onStartPlanning={handleStartJourney} />

      <Footer onStartJourney={handleStartJourney} />
    </div>
  );
};

export default LandingPage;
