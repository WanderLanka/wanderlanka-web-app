import React, { useState, useEffect } from 'react';
import { Star, MapPin } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      text: "Sri Lanka exceeded every expectation! The cultural richness, stunning landscapes, and warm hospitality made this trip unforgettable. Ceylon Explorer made everything seamless.",
      name: "Emma Thompson",
      location: "London, UK",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"
    },
    {
      text: "From climbing Sigiriya to whale watching in Mirissa, every moment was magical. The attention to detail and local insights were incredible. Already planning my return!",
      name: "Michael Chen",
      location: "Singapore",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      text: "The tea plantation tours and cultural experiences were absolutely breathtaking. Ceylon Explorer truly understands what makes Sri Lanka special.",
      name: "Sarah Williams",
      location: "Sydney, Australia", 
      image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50 to-emerald-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 opacity-0 animate-fade-in-up">
            Travelers <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent animate-gradient-shift">Love</span> Sri Lanka
          </h2>
          <p className="text-xl text-gray-600 opacity-0 animate-fade-in-up animation-delay-300">
            Real stories from real adventures
          </p>
        </div>

        <div className="relative">
          <div className="bg-gradient-to-r from-white to-green-50/50 backdrop-blur-sm rounded-3xl p-12 lg:p-16 shadow-2xl border border-green-100 opacity-0 animate-fade-in-up animation-delay-500 hover:shadow-3xl transition-shadow duration-300">
            <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-12">
              <img 
                src={testimonials[currentTestimonial].image} 
                alt={testimonials[currentTestimonial].name}
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl object-cover shadow-xl border-4 border-white animate-pulse-soft hover:scale-105 transition-transform duration-300"
              />
              
              <div className="flex-1 text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-4 opacity-0 animate-fade-in-up animation-delay-700">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-6 h-6 text-yellow-400 fill-current hover:scale-110 transition-transform duration-200"
                      style={{
                        animationDelay: `${800 + (i * 100)}ms`
                      }}
                    />
                  ))}
                </div>
                
                <blockquote className="text-2xl lg:text-3xl font-medium text-gray-800 mb-6 leading-relaxed opacity-0 animate-slide-in-left animation-delay-500">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                
                <div className="opacity-0 animate-slide-in-right animation-delay-700">
                  <div className="font-bold text-xl text-gray-900 transform hover:translate-x-2 transition-transform duration-200">{testimonials[currentTestimonial].name}</div>
                  <div className="text-green-600 font-medium flex items-center justify-center lg:justify-start mt-2 transform hover:translate-x-1 transition-transform duration-200">
                    <MapPin className="w-4 h-4 mr-2" />
                    {testimonials[currentTestimonial].location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Indicators */}
          <div className="flex justify-center mt-8 space-x-3 opacity-0 animate-fade-in-up animation-delay-700">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                  index === currentTestimonial 
                    ? 'bg-green-500 scale-125 animate-pulse-soft' 
                    : 'bg-gray-300 hover:bg-green-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
