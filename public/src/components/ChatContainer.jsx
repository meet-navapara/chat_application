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
        <button className="back-button" onClick={onBack} aria-label="Back">
          &#8592;
        </button>
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
        <Logout />
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
  grid-template-rows: auto 1fr auto; /* works better on all screens */
  height: 100vh;
  gap: 0.1rem;
  overflow: hidden;

  .chat-header {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    gap: 1rem;
    justify-content: space-between;
    background-color: #1e1e2f; /* optional for better contrast */

    .back-button {
      display: none;
      background: none;
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      flex-shrink: 0;

      &:hover {
        color: #4f04ff;
      }
    }

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-grow: 1;
      justify-content: center;
      overflow: hidden;

      .avatar img {
        height: 3rem;
        border-radius: 50%;
      }

      .username h3 {
        color: white;
        margin: 0;
        font-size: 1.2rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    > :last-child {
      flex-shrink: 0;
    }
  }

  .chat-messages {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
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
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #4f04ff21;
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
      margin-top: 1.5rem;

      .back-button {
        display: inline-block;
      }
    }

    > :last-child {
      margin-bottom: 1rem;
    }
  }
`;


