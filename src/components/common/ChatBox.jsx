import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, MessageCircle, AlertCircle, Search, ArrowLeft } from 'lucide-react';

// Dummy Data
const DUMMY_CONVERSATIONS = [
  {
    _id: 'c1',
    serviceType: 'accommodation',
    participants: [
      { role: 'traveler', username: 'john_doe' },
      { role: 'provider', username: 'hotelowner', name: 'Hotel Paradise' }
    ],
    unreadCount: { traveler: 2 },
    lastMessage: 'Your booking is confirmed!',
    title: "Chat with Hotel Paradise"
  },
  {
    _id: 'c2',
    serviceType: 'transport',
    participants: [
      { role: 'traveler', username: 'john_doe' },
      { role: 'provider', username: 'taxi_guru', name: 'Taxi Guru' }
    ],
    unreadCount: { traveler: 0 },
    lastMessage: 'See you at 10AM!',
    title: "Chat with Taxi Guru"
  }
];

const DUMMY_MESSAGES = {
  c1: [
    {
      _id: 'm1',
      senderRole: 'provider',
      content: 'Welcome to Hotel Paradise!',
      createdAt: new Date().setHours(9,30)
    },
    {
      _id: 'm2',
      senderRole: 'traveler',
      content: 'Thank you! When is check-in?',
      createdAt: new Date().setHours(9,35)
    },
    {
      _id: 'm3',
      senderRole: 'provider',
      content: 'Check-in is at 2 PM.',
      createdAt: new Date().setHours(9,40)
    }
  ],
  c2: [
    {
      _id: 'm4',
      senderRole: 'traveler',
      content: 'Is airport pickup available?',
      createdAt: new Date().setHours(10,10)
    },
    {
      _id: 'm5',
      senderRole: 'provider',
      content: 'Yes, we offer airport pickup for free!',
      createdAt: new Date().setHours(10,12)
    }
  ]
};

const DEFAULT_AI_BOT_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    content: "Hello! I'm your AI travel assistant",
    timestamp: Date.now()
  }
];

const ChatBox = ({ isOpen, onClose }) => {
  // Simulated backend state
  const [conversations, setConversations] = useState(DUMMY_CONVERSATIONS);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAiBotMode, setIsAiBotMode] = useState(false);
  const [aiBotMessages, setAiBotMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showReceiverSelection, setShowReceiverSelection] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // On open, show receiver selection
  useEffect(() => {
    if (isOpen) {
      setShowReceiverSelection(true);
      setIsAiBotMode(false);
      setCurrentConversation(null);
      setMessages([]);
      setAiBotMessages([]);
    }
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiBotMessages]);

  // Simulated reading and switching conversations
  useEffect(() => {
    if (currentConversation) {
      setShowReceiverSelection(false);
      setIsAiBotMode(false);
    }
  }, [currentConversation]);

  useEffect(() => {
    if (isAiBotMode) {
      setShowReceiverSelection(false);
    }
  }, [isAiBotMode]);

  const handleSelectReceiver = (conversation) => {
    setLoading(true);
    setTimeout(() => {
      setMessages(DUMMY_MESSAGES[conversation._id] || []);
      setCurrentConversation(conversation);      
      setLoading(false);
      setError('');
    }, 300);
  };

  const handleBackToReceivers = () => {
    setShowReceiverSelection(true);
    setCurrentConversation(null);
    setIsAiBotMode(false);
    setMessages([]);
    setAiBotMessages([]);
  };

  const handleOpenAiBot = () => {
    setShowReceiverSelection(false);
    setIsAiBotMode(true);
    if (aiBotMessages.length === 0) setAiBotMessages([...DEFAULT_AI_BOT_MESSAGES]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (isAiBotMode) {
      // Fake AI bot reply
      const userMsg = {
        id: Date.now(),
        sender: 'user',
        content: newMessage,
        timestamp: Date.now()
      };
      setAiBotMessages((prev) => [...prev, userMsg]);
      setNewMessage('');
      setTimeout(() => {
        const botReply = {
          id: Date.now() + 1,
          sender: 'bot',
          content: "This is a dummy AI reply. Ask me anything about Sri Lanka!",
          timestamp: Date.now()
        };
        setAiBotMessages(prev => [...prev, botReply]);
      }, 800);
    } else if (currentConversation) {
      const newMsg = {
        _id: Date.now().toString(),
        senderRole: 'traveler',
        content: newMessage,
        createdAt: Date.now()
      };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getProviderName = (conversation = currentConversation) => {
    if (!conversation) return 'Provider';
    const provider = conversation.participants?.find(
      p => p.role !== 'traveler'
    );
    if (provider) {
      return provider.username ||
        provider.name ||
        provider.displayName ||
        provider.email?.split('@')[0] ||
        'Provider';
    }
    return conversation.providerName ||
      conversation.provider?.username ||
      conversation.provider?.name ||
      conversation.serviceProviderName ||
      `${conversation.serviceType} Provider`;
  };

  const getFilteredConversations = () => {
    if (!searchQuery.trim()) return conversations;
    const searchTerm = searchQuery.toLowerCase();
    return conversations.filter(conversation => {
      const providerName = getProviderName(conversation).toLowerCase();
      const serviceType = conversation.serviceType?.toLowerCase() || '';
      return providerName.includes(searchTerm) ||
        serviceType.includes(searchTerm) ||
        conversation.title?.toLowerCase().includes(searchTerm) ||
        (conversation.lastMessage || '').toLowerCase().includes(searchTerm);
    });
  };

  const getServiceIcon = (conversation = currentConversation) => {
    const serviceType = conversation?.serviceType || 'default';
    switch (serviceType) {
      case 'accommodation':
        return '🏨';
      case 'transport':
        return '🚗';
      default:
        return '💬';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="bg-green-500 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">
              {showReceiverSelection ? 'Select Chat' :
                isAiBotMode ? 'AI Assistant' :
                  `Chat with ${getProviderName()}`}
            </h3>
            <p className="text-xs text-green-100 flex items-center">
              <span className="mr-1">
                {isAiBotMode ? '🤖' : getServiceIcon()}
              </span>
              {showReceiverSelection ? 'Choose a conversation' :
                isAiBotMode ? 'AI is ready to help' :
                  'Active'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!showReceiverSelection && (
            <button
              onClick={handleBackToReceivers}
              className="text-white hover:text-gray-200 transition-colors p-1"
              title="Back to conversations"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Receiver Selection or Messages */}
      <div className="flex-1 overflow-y-auto">
        {showReceiverSelection ? (
          <div className="p-4">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* AI Bot Option */}
            <div className="mb-4">
              <button
                onClick={handleOpenAiBot}
                className="w-full p-3 text-left hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors bg-blue-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900">AI Assistant</h4>
                    <p className="text-sm text-gray-500">Get instant help with your travel questions</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </button>
            </div>

            {/* Conversations List */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Conversations</h4>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                </div>
              ) : getFilteredConversations().length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No conversations found</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {searchQuery ? 'Try a different search term' : 'Start a new conversation'}
                  </p>
                </div>
              ) : (
                getFilteredConversations().map((conversation) => (
                  <button
                    key={conversation._id}
                    onClick={() => handleSelectReceiver(conversation)}
                    className="w-full p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">{getServiceIcon(conversation)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {getProviderName(conversation)}
                        </h4>
                        <p className="text-sm text-gray-500 capitalize">
                          {conversation.serviceType} Service
                        </p>
                        {conversation.lastMessage && (
                          <p className="text-xs text-gray-400 truncate mt-1">
                            {conversation.lastMessage}
                          </p>
                        )}
                      </div>
                      {conversation.unreadCount && conversation.unreadCount.traveler > 0 && (
                        <div className="w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conversation.unreadCount.traveler}
                        </div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="p-4 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : isAiBotMode ? (
              /* AI Bot Messages */
              aiBotMessages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <Bot className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Hello! I'm your AI travel assistant</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Ask me anything about your travel plans
                  </p>
                </div>
              ) : (
                aiBotMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )
            ) : (
              /* Normal Chat Messages */
              messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Start a conversation!</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Ask questions about this {currentConversation?.serviceType} service
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.senderRole === 'traveler' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        message.senderRole === 'traveler'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderRole === 'traveler' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input - Only show when in chat mode */}
      {!showReceiverSelection && (
        <div className="p-3 border-t border-gray-200">
          {/* Removed Call option here */}
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isAiBotMode ? "Ask me anything about your travel..." : "Type your message..."}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={(!currentConversation && !isAiBotMode) || loading}
            />
            <button
              type="submit"
              disabled={(!currentConversation && !isAiBotMode) || !newMessage.trim() || loading}
              className="w-8 h-8 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
