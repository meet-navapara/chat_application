import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";

export default function Welcome({ isMobile }) {
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.username);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    fetchUser();
  }, []);

  return (
    <Container isMobile={isMobile}>
      <div className="content-wrapper">
        <img 
          src={Robot} 
          alt="Welcome robot" 
          className="welcome-robot"
        />
        <div className="text-content">
          <h1>
            Welcome, <span>{userName}!</span>
          </h1>
          <h3>Please select a chat to start messaging</h3>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${props => props.isMobile ? '#131324' : 'transparent'};
  padding: ${props => props.isMobile ? '2rem' : '0'};
  box-sizing: border-box;

  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 600px;
    width: 100%;
    text-align: center;
    gap: 1.5rem;
    padding: ${props => props.isMobile ? '2rem' : '0'};
  }

  .welcome-robot {
    height: ${props => props.isMobile ? '12rem' : '20rem'};
    max-height: 100%;
    object-fit: contain;
    border-radius: ${props => props.isMobile ? '50%' : 'none'};
    background: ${props => props.isMobile ? '#00000076' : 'transparent'};
    padding: ${props => props.isMobile ? '1rem' : '0'};
  }

  .text-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  h1 {
    color: white;
    font-size: ${props => props.isMobile ? '1.8rem' : '2.5rem'};
    margin: 0;
    font-weight: 600;
    line-height: 1.2;
  }

  span {
    color: #4e0eff;
    font-weight: 700;
  }

  h3 {
    color: #ffffffb3;
    font-size: ${props => props.isMobile ? '1rem' : '1.2rem'};
    margin: 0;
    font-weight: 400;
  }

  @media (max-width: 480px) {
    .welcome-robot {
      height: 10rem;
    }

    h1 {
      font-size: 1.5rem;
    }

    h3 {
      font-size: 0.9rem;
    }
  }
`;