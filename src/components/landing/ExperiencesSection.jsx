import React from 'react';
import { Mountain, Waves, TreePine, Camera } from 'lucide-react';

const ExperiencesSection = () => {
  const experiences = [
    {
      icon: Mountain,
      title: "Trek to World's End",
      description: "Hike through Horton Plains to the dramatic cliff edge offering breathtaking views of the island below.",
    },
    {
      icon: Waves,
      title: "Whale Watching in Mirissa",
      description: "Encounter blue whales, sperm whales, and dolphins in the deep waters of the Indian Ocean.",
    },
    {
      icon: TreePine,
      title: "Tea Plantation Tours",
      description: "Learn about Ceylon tea production and enjoy tastings in the misty hills of Nuwara Eliya.",
    },
    {
      icon: Camera,
      title: "Wildlife Photography Safari",
      description: "Capture leopards, elephants, and exotic birds in their natural habitat across national parks.",
    }
  ];

  return (
    <section id="experiences" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 opacity-0 animate-fade-in-up">
            Unique <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent animate-gradient-shift">Experiences</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in-up animation-delay-300">
            Immerse yourself in authentic Sri Lankan culture and adventures
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8">
            {experiences.map((experience, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-6 group opacity-0 animate-slide-in-left"
                style={{
                  animationDelay: `${600 + (index * 200)}ms`
                }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg animate-pulse-soft">
                  <experience.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 transform group-hover:translate-x-2 transition-transform duration-300">{experience.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg transform group-hover:translate-x-1 transition-transform duration-300 delay-75">{experience.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative opacity-0 animate-slide-in-right animation-delay-500">
            <img 
              src="https://plus.unsplash.com/premium_photo-1692049122910-d8b131ed54c1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Sri Lankan Tea Plantation"
              className="w-full h-96 lg:h-[600px] object-cover rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent rounded-3xl hover:from-green-900/40 transition-all duration-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperiencesSection;
