import React, { createContext, useContext, useState, useEffect } from 'react';
import { chatAPI, aiBotAPI } from '../services/api';

const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAiBotMode, setIsAiBotMode] = useState(false);
  const [aiBotMessages, setAiBotMessages] = useState([]);

  // Load user conversations on mount - with error handling
  useEffect(() => {
    const initializeChat = async () => {
      try {
        await loadConversations();
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        // Don't throw the error, just log it and continue
      }
    };
    
    initializeChat();
  }, []);
  const loadConversations = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading conversations...');
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('⚠️ No authentication token found');
        setError('Please log in to access conversations');
        setConversations([]);
        return;
      }
      
      const data = await chatAPI.getConversations();
      console.log('✅ Conversations loaded successfully:', data);
      setConversations(data || []);
      setError(null);
    } catch (error) {
      console.error('❌ Failed to load conversations:', error);
      
      // More specific error messages
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.statusText;
        
        if (status === 401) {
          setError('Authentication required. Please log in again.');
        } else if (status === 403) {
          setError('Access denied. You do not have permission to view conversations.');
        } else if (status === 404) {
          setError('Chat service not found. Please check if the service is running.');
        } else if (status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Failed to load conversations: ${message}`);
        }
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        setError('Cannot connect to server. Please check if the API Gateway is running.');
      } else {
        setError(`Failed to load conversations: ${error.message}`);
      }
      
      setConversations([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (serviceType, serviceId, bookingId = null) => {
    try {
      setLoading(true);
      const conversation = await chatAPI.createConversation({
        serviceType,
        serviceId,
        bookingId
      });
      setConversations(prev => [conversation, ...prev]);
      setError(null);
      return conversation;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      setError('Failed to create conversation');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const openConversation = async (conversationId) => {
    try {
      setLoading(true);
      const conversation = await chatAPI.getConversation(conversationId);
      const messages = await chatAPI.getMessages(conversationId);
      
      setCurrentConversation(conversation);
      setMessages(messages);
      setIsChatOpen(true);
      setError(null);
    } catch (error) {
      console.error('Failed to open conversation:', error);
      setError('Failed to open conversation');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content) => {
    if (!currentConversation) return;
    
    try {
      const message = await chatAPI.sendMessage(currentConversation._id, content);
      setMessages(prev => [...prev, message]);
      setError(null);
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message');
      throw error;
    }
  };

  const markAsRead = async (conversationId) => {
    try {
      await chatAPI.markAsRead(conversationId);
      // Update local state to reflect read status
      setConversations(prev => 
        prev.map(conv => 
          conv._id === conversationId 
            ? { ...conv, unreadCount: { ...conv.unreadCount, [getCurrentUserRole()]: 0 } }
            : conv
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const getCurrentUserRole = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.role;
      }
    } catch (error) {
      console.error('Error parsing stored user data:', error);
    }
    return 'traveler';
  };

  const openChatWithProvider = async (serviceType, serviceId, bookingId = null) => {
    try {
      // Check if conversation already exists
      const existingConversation = conversations.find(
        conv => conv.serviceType === serviceType && conv.serviceId === serviceId
      );

      if (existingConversation) {
        await openConversation(existingConversation._id);
      } else {
        // Create new conversation
        const conversation = await createConversation(serviceType, serviceId, bookingId);
        await openConversation(conversation._id);
      }
    } catch (error) {
      console.error('Failed to open chat with provider:', error);
      setError('Failed to open chat with provider');
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setCurrentConversation(null);
    setMessages([]);
    setError(null);
  };

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  const openChat = () => {
    setIsChatOpen(true);
  };

  // AI Bot functions
  const openAiBot = async () => {
    try {
      setIsAiBotMode(true);
      setCurrentConversation(null);
      setMessages([]);
      setError(null);
      
      // Load AI bot conversation history
      const history = await aiBotAPI.getConversationHistory();
      setAiBotMessages(history || []);
    } catch (error) {
      console.error('Failed to open AI bot:', error);
      setError('Failed to open AI bot');
    }
  };

  const sendAiBotMessage = async (content) => {
    try {
      const userMessage = {
        id: Date.now(),
        content,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      setAiBotMessages(prev => [...prev, userMessage]);
      
      const response = await aiBotAPI.sendMessage(content);
      
      const botMessage = {
        id: Date.now() + 1,
        content: response.message || response.reply,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      setAiBotMessages(prev => [...prev, botMessage]);
      setError(null);
    } catch (error) {
      console.error('Failed to send AI bot message:', error);
      setError('Failed to send message to AI bot');
    }
  };

  const closeAiBot = () => {
    setIsAiBotMode(false);
    setAiBotMessages([]);
    setError(null);
  };

  const value = {
    isChatOpen,
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    isAiBotMode,
    aiBotMessages,
    toggleChat,
    openChat,
    closeChat,
    createConversation,
    openConversation,
    sendMessage,
    markAsRead,
    loadConversations,
    openChatWithProvider,
    openAiBot,
    sendAiBotMessage,
    closeAiBot
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
