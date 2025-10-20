import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import ChatButton from './ChatButton';
import ChatBox from './ChatBox';

const ChatWidget = () => {
  const { isChatOpen, toggleChat, closeChat } = useChat();

  return (
    <>
      <ChatButton onClick={toggleChat} isOpen={isChatOpen} />
      <ChatBox isOpen={isChatOpen} onClose={closeChat} />
    </>
  );
};

export default ChatWidget;
