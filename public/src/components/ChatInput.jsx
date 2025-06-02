import React, { useState, useEffect, useRef } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    setMsg(prevMsg => prevMsg + emojiObject.emoji);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.trim().length > 0) {
      handleSendMsg(msg);
      setMsg("");
      setShowEmojiPicker(false);
    }
  };

  return (
    <Container>
      <div className="button-container" ref={emojiPickerRef}>
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && (
            <div className="emoji-picker-wrapper">
              <Picker 
                onEmojiClick={handleEmojiClick} 
                width={window.innerWidth > 720 ? 350 : 280}
                height={400}
              />
            </div>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="Type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0.5rem;
  gap: 0.5rem;

  @media screen and (max-width: 720px) {
    grid-template-columns: 10% 90%;
    padding: 0.3rem;
    gap: 0.3rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;

    .emoji {
      position: relative;
      
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
        
        @media screen and (max-width: 720px) {
          font-size: 1.3rem;
        }
      }

      .emoji-picker-wrapper {
        position: absolute;
        bottom: 50px;
        left: 0;
        z-index: 10;

        @media screen and (max-width: 720px) {
          left: -100px;
        }
      }

      .emoji-picker-react {
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;

        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          
          &-thumb {
            background-color: #9a86f3;
          }
        }

        .emoji-categories button {
          filter: contrast(0);
        }

        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }

        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }

  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: #ffffff34;
    padding: 0.5rem 1rem;

    @media screen and (max-width: 720px) {
      gap: 0.5rem;
      padding: 0.3rem 0.8rem;
    }

    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      font-size: 1.1rem;

      @media screen and (max-width: 720px) {
        font-size: 1rem;
      }

      &::placeholder {
        color: #ffffffa0;
      }

      &::selection {
        background-color: #9a86f3;
      }

      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0.3rem 1.5rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      cursor: pointer;

      @media screen and (max-width: 720px) {
        padding: 0.2rem 1rem;
      }

      svg {
        font-size: 1.5rem;
        color: white;

        @media screen and (max-width: 720px) {
          font-size: 1.2rem;
        }
      }

      &:hover {
        background-color: #8a76e3;
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }`
;

