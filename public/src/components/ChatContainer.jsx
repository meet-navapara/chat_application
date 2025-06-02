import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket, onBack }) {
  const [messages, setMessages] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollRef = useRef();
  const messagesEndRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [chatHeight, setChatHeight] = useState(window.innerHeight);

useEffect(() => {
  const resizeChat = () => {
    setChatHeight(window.innerHeight);
  };

  window.addEventListener("resize", resizeChat);
  return () => window.removeEventListener("resize", resizeChat);
}, []);

  // Handle keyboard on mobile devices
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        setKeyboardHeight(window.innerHeight - window.visualViewport.height);
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  // Fetch messages
  useEffect(() => {
    (async () => {
      if (!currentChat) return;
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    })();
  }, [currentChat]);

  // Handle sending messages
  const handleSendMsg = useCallback(async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
  }, [currentChat, socket]);

  // Socket message receive
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  // Add arrival messages
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Memoized message item component
  const MessageItem = React.memo(({ message }) => (
    <div ref={scrollRef} key={uuidv4()}>
      <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
        <div className="content">
          <p>{message.message}</p>
        </div>
      </div>
    </div>
  ));

  return (
    <Container keyboardHeight={keyboardHeight}>
      <div className="chat-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack} aria-label="Back">
            &#8592;
          </button>
        </div>
        <div className="header-center">
          <div className="user-details">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                alt="avatar"
                loading="lazy"
              />
            </div>
            <div className="username">
              <h3>{currentChat.username}</h3>
            </div>
          </div>
        </div>
        <div className="header-right">
          <Logout />
        </div>
      </div>
      
      <div className="chat-messages">
        {false ? (
          <div className="loading-messages">Loading messages...</div>
        ) : messages.length > 0 ? (
          messages.map((message, index) => (
          <MessageItem key={`msg-${index}`} message={message} />
          ))
        ) : (
          <div className="no-messages">No messages yet</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInputWrapper>
        <ChatInput handleSendMsg={handleSendMsg} />
      </ChatInputWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  height: -webkit-fill-available;
  min-height: -webkit-fill-available;
  width: 100%;
 
  background-color: #131324;
  padding-bottom: ${props => props.keyboardHeight}px;
  transition: padding-bottom 0.3s ease;

  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }

  .chat-header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: 0.8rem 1rem;
    background-color: #1e1e2f;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    top: 0;
    z-index: 100;
    min-height: 60px;

    .header-left, .header-center, .header-right {
      display: flex;
      align-items: center;
      height: 100%;
    }

    .header-left {
      justify-content: flex-start;
      min-width: 40px;
    }

    .header-center {
      justify-content: center;
      flex-grow: 1;
      overflow: hidden;
    }

    .header-right {
      justify-content: flex-end;
      min-width: 40px;
    }

    .back-button {
      display: none;
      background: none;
      border: none;
      color: white;
      font-size: 1.8rem;
      cursor: pointer;
      padding: 0.5rem;
      margin-right: 0rem;
      transition: color 0.3s ease;
      touch-action: manipulation;
      
      &:hover, &:active {
        color: #4f04ff;
        transform: scale(0.95);
      }
    }

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: 100%;
      overflow: hidden;

      .avatar img {
        height: 2.8rem;
        width: 2.8rem;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #4e0eff;
      }

      .username h3 {
        color: white;
        margin: 0;
        font-size: 1.1rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .chat-messages {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    scroll-behavior: smooth;
    padding-bottom: env(safe-area-inset-bottom);
    
    .loading-messages,
    .no-messages {
      color: #aaa;
      text-align: center;
      margin-top: 2rem;
    }
    &::-webkit-scrollbar {
      width: 0.3rem;

      &-thumb {
        background-color: #4e0eff;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      transition: transform 0.2s ease;

      &:active {
        transform: scale(0.98);
      }

      .content {
        max-width: 80%;
        padding: 0.8rem 1rem;
        font-size: 0.95rem;
        border-radius: 1rem;
        color: #d1d1d1;
        overflow-wrap: break-word;
        line-height: 1.4;
        user-select: text;
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #4f04ff;
        color: white;
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background-color: #9900ff20;
      }
    }
  }

  @media screen and (max-width: 768px) {
  position: fixed;
  overflow: hidden;
  top: 0;
  left: 0;
    .chat-header {
      padding: 0.8rem 0.8rem;
      min-height: 55px;

      .back-button {
        display: block;
      }
      
      .user-details {
        gap: 0.8rem;
        
        .avatar img {
          height: 2.4rem;
          width: 2.4rem;
        }
        
        .username h3 {
          font-size: 1rem;
        }
      }
    }

    .chat-messages {
      padding: 0.8rem;
      gap: 0.8rem;

      .message .content {
        max-width: 85%;
        padding: 0.7rem 0.9rem;
        font-size: 0.9rem;
      }
    }
  }

  @media screen and (max-width: 480px) {
  position: fixed;
  overflow: hidden;
  top: 0;
  left: 0;
    .chat-header {
      padding: 0.7rem 0.6rem;
      min-height: 50px;

      .user-details {
        .avatar img {
          height: 2.2rem;
          width: 2.2rem;
        }
        
        .username h3 {
          font-size: 0.95rem;
        }
      }
    }

    .chat-messages {
      padding: 0.6rem;
    }
  }
`;

const ChatInputWrapper = styled.div`
  padding: 0.5rem 1rem;
  padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
  background: #1e1e2f;
  position: sticky;
  bottom: 0;
  z-index: 50;
  transition: padding-bottom 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.5rem;
    padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
  }
`;