import React from 'react';

const CultureSection = () => {
  const cultureItems = [
    {
      title: "Ancient Buddhism",
      description: "Sacred temples, meditation retreats, and spiritual journeys in the footsteps of ancient monks.",
      image: "https://images.unsplash.com/photo-1709729508706-87741ec2d50a?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Colonial Legacy", 
      description: "Dutch forts, British hill stations, and Portuguese churches tell stories of maritime empires.",
      image: "https://plus.unsplash.com/premium_photo-1754258454043-f009722777d0?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Living Traditions",
      description: "Vibrant festivals, classical dance, traditional crafts, and warm hospitality of local communities.",
      image: "https://images.unsplash.com/photo-1663471984093-5925e87e72d5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      color: "from-pink-500 to-rose-600"
    }
  ];

  return (
    <section id="culture" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 opacity-0 animate-fade-in-up">
          Rich <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent animate-gradient-shift">Cultural</span> Heritage
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-16 opacity-0 animate-fade-in-up animation-delay-300">
          Experience 2,500 years of history, traditions, and spiritual heritage
        </p>

        <div className="grid md:grid-cols-3 gap-12">
          {cultureItems.map((item, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 opacity-0 animate-fade-in-up"
              style={{
                animationDelay: `${600 + (index * 200)}ms`
              }}
            >
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/60 transition-all duration-300"></div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-3 transform translate-x-[-10px] group-hover:translate-x-0 transition-transform duration-300">{item.title}</h3>
                <p className="text-gray-200 leading-relaxed transform translate-y-2 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">{item.description}</p>
              </div>

              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CultureSection;
