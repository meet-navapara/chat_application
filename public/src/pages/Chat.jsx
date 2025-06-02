import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Enhanced mobile view detection
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile !== isMobileView) {
        setIsMobileView(isMobile);
        // Reset chat view when switching to mobile to avoid layout issues
        if (isMobile) setCurrentChat(undefined);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [isMobileView]);

  // Added async function separately for better error handling
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
        if (!user) {
          navigate("/login");
        } else {
          setCurrentUser(JSON.parse(user));
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login");
      }
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(process.env.REACT_APP_API_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });
      socket.current.emit("add-user", currentUser._id);
      
      return () => {
        if (socket.current) socket.current.disconnect();
      };
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        try {
          if (currentUser.isAvatarImageSet) {
            const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(data);
          } else {
            navigate("/setAvatar");
          }
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const handleBackToContacts = () => {
    setCurrentChat(undefined);
  };

  return (
    <Container>
      <div className="container">
        {(!isMobileView || (isMobileView && currentChat === undefined)) && (
          <Contacts 
            contacts={contacts} 
            changeChat={handleChatChange} 
            isMobile={isMobileView}
            currentUser={currentUser}
          />
        )}
    {(!isMobileView && currentChat === undefined) ? (
  <Welcome currentUser={currentUser} isMobile={isMobileView} />
) : (
  currentChat !== undefined && (
    <ChatContainer
      currentChat={currentChat}
      socket={socket}
      isMobile={isMobileView}
      onBack={handleBackToContacts}
      currentUser={currentUser}
    />
  )
)}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #131324;
  overflow: hidden;
  
  .container {
    height: 100vh;
    width: 100vw;
    background-color: #00000076;
    display: grid;
    position: relative;
    
    @media screen and (min-width: 769px) {
      height: 90vh;
      width: 90vw;
      max-width: 1800px;
      max-height: 1000px;
      border-radius: 1rem;
      overflow: hidden;
      grid-template-columns: 30% 70%;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
    }
    
    @media screen and (min-width: 1024px) {
      grid-template-columns: 25% 75%;
    }
    
    @media screen and (max-width: 768px) {
      grid-template-columns: 100%;
      transition: all 0.3s ease;
    }
  }
`;