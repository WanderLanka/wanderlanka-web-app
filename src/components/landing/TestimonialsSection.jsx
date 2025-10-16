import React from 'react';
import { Star, MapPin } from 'lucide-react';

const TestimonialsSection = () => {
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

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-green-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 opacity-0 animate-fade-in-up">
            Travelers <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent animate-gradient-shift">Love</span> Sri Lanka
          </h2>
          <p className="text-xl text-gray-400 opacity-0 animate-fade-in-up animation-delay-300">
            Real stories from real adventures
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-green-100 opacity-0 animate-fade-in-up hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              style={{ animationDelay: `${500 + index * 200}ms` }}
            >
              {/* Rating Stars */}
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-4 h-4 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-200"
                  />
                ))}
              </div>
              
              {/* Testimonial Text */}
              <blockquote className="text-gray-700 text-sm leading-relaxed mb-6 text-center line-clamp-4">
                "{testimonial.text}"
              </blockquote>
              
              {/* User Info */}
              <div className="flex flex-col items-center space-y-3">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-white group-hover:scale-110 transition-transform duration-300"
                />
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                  <div className="text-green-600 text-xs font-medium flex items-center justify-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
