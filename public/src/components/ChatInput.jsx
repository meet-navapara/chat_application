import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.trim().length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
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
  grid-template-columns: 100%;
  background-color: #080420;
  padding: 0.5rem;

  @media screen and (max-width: 720px) {
    padding: 0.3rem;
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
  }
`;
