import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';

// Helper function to get provider name (same logic as in ChatBox)
const getProviderName = (conversation) => {
  if (!conversation) return 'Provider';
  
  const provider = conversation.participants?.find(
    p => p.role !== 'traveler'
  );
  
  // Try to get the actual provider name from various possible fields
  if (provider) {
    return provider.username || 
           provider.name || 
           provider.displayName || 
           provider.email?.split('@')[0] || 
           'Provider';
  }
  
  // If no provider found in participants, try to get from conversation data
  return conversation.providerName || 
         conversation.provider?.username || 
         conversation.provider?.name ||
         conversation.serviceProviderName ||
         `${conversation.serviceType} Provider`;
};

const ChatWidget = () => {
  const { isChatOpen, toggleChat, conversations } = useChat();
  const [showConversations, setShowConversations] = useState(false);

  const unreadCount = conversations.reduce((total, conv) => {
    const userRole = JSON.parse(localStorage.getItem('user') || '{}').role || 'traveler';
    return total + (conv.unreadCount?.[userRole] || 0);
  }, 0);

  return (
    <>
      {/* Chat Button */}
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          title="Open Chat"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Conversations List */}
      {showConversations && (
        <div className="fixed bottom-24 right-6 z-40 w-80 bg-white rounded-lg shadow-2xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Your Conversations</h3>
              <button
                onClick={() => setShowConversations(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs text-gray-400">Start chatting with service providers</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation._id}
                  className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    // This would open the specific conversation
                    setShowConversations(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-gray-800">
                        {conversation.serviceType === 'accommodation' ? '🏨' : '🚗'} 
                        {getProviderName(conversation)}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                    {conversation.unreadCount && (
                      <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unreadCount[conversation.participants[0].role] || 0}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
