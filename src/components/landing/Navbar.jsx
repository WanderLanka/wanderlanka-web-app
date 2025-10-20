import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../common/Logo';
import NavButton from '../common/NavButton';

const Navbar = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  scrollToSection
}) => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-xl border-b border-green-100/50 animate-slide-down">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-4">
          <div className="animate-fade-in-left">
            <Logo />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 animate-fade-in-right">
            <NavButton onClick={() => scrollToSection('destinations')}>
              Destinations
            </NavButton>
            <NavButton onClick={() => scrollToSection('experiences')}>
              Experiences
            </NavButton>
            <NavButton onClick={() => scrollToSection('culture')}>
              Culture
            </NavButton>
            <NavButton onClick={() => scrollToSection('testimonials')}>
              Reviews
            </NavButton>
            <NavButton 
              variant="secondary"
              onClick={() => navigate("/auth", { state: { mode: "login" } })}>
              Login
            </NavButton>
            <NavButton 
              variant="primary"
              onClick={() => navigate("/auth", { state: { mode: "signup" } })}>
              Sign Up
            </NavButton>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-300 hover:scale-110 hover:rotate-90 animate-fade-in-right"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 space-y-4 border-t border-green-100/50 animate-slide-down">
            <NavButton 
              variant="mobile"
              onClick={() => {
                scrollToSection('destinations');
                setIsMenuOpen(false);
              }}
            >
              Destinations
            </NavButton>
            <NavButton 
              variant="mobile"
              onClick={() => {
                scrollToSection('experiences');
                setIsMenuOpen(false);
              }}
            >
              Experiences
            </NavButton>
            <NavButton 
              variant="mobile"
              onClick={() => {
                scrollToSection('culture');
                setIsMenuOpen(false);
              }}
            >
              Culture
            </NavButton>
            <NavButton 
              variant="mobile"
              onClick={() => {
                scrollToSection('testimonials');
                setIsMenuOpen(false);
              }}
            >
              Reviews
            </NavButton>
            
            <div className="flex space-x-4 pt-4">
              <NavButton 
                variant="mobileSecondary"
                onClick={() => {
                  navigate('/auth');
                  setIsMenuOpen(false);
                }}
              >
                Login
              </NavButton>
              <NavButton 
                variant="mobilePrimary"
                onClick={() => {
                  navigate('/auth');
                  setIsMenuOpen(false);
                }}
              >
                Sign Up
              </NavButton>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
