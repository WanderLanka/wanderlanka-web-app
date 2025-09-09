import React from 'react';
import { Calendar, MapPin, Users, ChevronRight } from 'lucide-react';
import { Button } from '../common';

const PlanningSection = ({ onStartPlanning }) => {
  const planningSteps = [
    {
      icon: Calendar,
      title: "Choose Your Dates",
      description: "Select when you want to explore Sri Lanka. We'll recommend the best experiences for your travel season.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: MapPin,
      title: "Pick Your Adventures", 
      description: "From ancient temples to wildlife safaris, choose from hundreds of curated experiences across the island.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Users,
      title: "Travel Your Way",
      description: "Solo explorer, couple's retreat, or family adventure - we customize every detail to match your style.",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 opacity-0 animate-fade-in-up">
            Plan Your <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient-shift">Perfect</span> Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in-up animation-delay-300">
            Whether you're seeking adventure, relaxation, or cultural immersion, we'll craft your ideal Sri Lankan experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {planningSteps.map((step, index) => (
            <div 
              key={index} 
              className="group relative opacity-0 animate-fade-in-up"
              style={{
                animationDelay: `${600 + (index * 200)}ms`
              }}
            >
              <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200">
                <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg animate-pulse-soft`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 transform group-hover:translate-y-[-2px] transition-transform duration-200">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed transform group-hover:translate-y-[-1px] transition-transform duration-200 delay-75">{step.description}</p>
                
                <div className="absolute top-0 right-8 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg animate-bounce-in group-hover:scale-110 transition-transform duration-200">
                  {index + 1}
                </div>

                {/* Hover overlay effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl`}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button 
            onClick={onStartPlanning} 
            variant="primary"
            size="xl"
            className="group bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-2xl opacity-0 animate-fade-in-up animation-delay-700 animate-pulse-subtle px-12 py-6 text-xl font-bold rounded-2xl"
          >
            Start Planning Your Sri Lankan Adventure
            <ChevronRight className="w-7 h-7 ml-3 inline group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PlanningSection;
