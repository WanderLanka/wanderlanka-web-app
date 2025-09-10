import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import components
import Navbar from '../components/landing/Navbar';
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
  const navigate = useNavigate();

  const sriLankanDestinations = [
    "Sigiriya", "Kandy", "Galle", "Ella", "Nuwara Eliya", "Anuradhapura", "Polonnaruwa", "Yala",
    "Arugam Bay", "Mirissa", "Hikkaduwa", "Bentota", "Trincomalee", "Dambulla", "Horton Plains"
  ];

  const handleStartJourney = () => navigate('/auth');

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative">
      <BackgroundElements />
      
      <Navbar 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        scrollToSection={scrollToSection}
      />

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
