import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket, onBack }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

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

  const handleSendMsg = async (msg) => {
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
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
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
        {messages.map((message) => (
          <div ref={scrollRef} key={uuidv4()}>
            <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  gap: 0.1rem;
  overflow: hidden;
  background-color: #131324;

  .chat-header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: 0.8rem 1.5rem;
    background-color: #1e1e2f;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: sticky;
    top: 0;
    z-index: 10;

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
      margin-right: 0.5rem;
      transition: color 0.3s ease;
      
      &:hover {
        color: #4f04ff;
      }
    }

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: 100%;
      overflow: hidden;

      .avatar img {
        height: 3rem;
        width: 3rem;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #4e0eff;
      }

      .username h3 {
        color: white;
        margin: 0;
        font-size: 1.2rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      width: 0.4rem;

      &-thumb {
        background-color: #4e0eff;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;

      .content {
        max-width: 70%;
        padding: 1rem;
        font-size: 1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        overflow-wrap: break-word;
        line-height: 1.4;
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
    .chat-header {
      padding: 0.8rem 1rem;

      .back-button {
        display: block;
      }
      
      .user-details {
        gap: 0.8rem;
        
        .avatar img {
          height: 2.5rem;
          width: 2.5rem;
        }
        
        .username h3 {
          font-size: 1.1rem;
        }
      }
    }

    .chat-messages {
      padding: 1rem;
    }
  }

  @media screen and (max-width: 480px) {
    .chat-header {
      .user-details {
        .avatar img {
          height: 2.2rem;
          width: 2.2rem;
        }
        
        .username h3 {
          font-size: 1rem;
        }
      }
    }
  }
`;