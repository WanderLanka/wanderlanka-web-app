import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatButton = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
        isOpen 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-green-500 hover:bg-green-600'
      }`}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <div className="flex items-center justify-center h-full">
        {isOpen ? (
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </div>
    </button>
  );
};

export default ChatButton;
