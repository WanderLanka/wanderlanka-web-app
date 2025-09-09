import React from 'react';

const BackgroundElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div className="absolute -bottom-32 left-20 w-72 h-72 bg-teal-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
    </div>
  );
};

export default BackgroundElements;
