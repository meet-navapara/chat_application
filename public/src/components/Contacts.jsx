import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";

export default function Contacts({ contacts, changeChat, isMobile }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        setCurrentUserName(data.username);
        setCurrentUserImage(data.avatarImage);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container isMobile={isMobile}>
          <div className="header">
            <div className="brand">
              <img src={Logo} alt="logo" />
              <h3>EchoChat</h3>
            </div>
            {isMobile && (
              <div className="mobile-user-avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentUserImage}`}
                  alt="Your avatar"
                />
              </div>
            )}
          </div>
          
          <div className="contacts-container">
            <div className="contacts">
              {contacts.map((contact, index) => (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt={`${contact.username}'s avatar`}
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {!isMobile && (
            <div className="current-user">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentUserImage}`}
                  alt="Your avatar"
                />
              </div>
              <div className="username">
                <h2>{currentUserName}</h2>
              </div>
            </div>
          )}
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: ${props => props.isMobile ? '12% 88%' : '10% 75% 15%'};
  overflow: hidden;
  background-color: #080420;
  width: 100%;
  height: 100vh;
  height: -webkit-fill-available;
  position: relative;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    background-color: #0d0d30;
    position: sticky;
    top: 0;
    z-index: 10;
    min-height: 60px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    img {
      height: ${props => props.isMobile ? '1.8rem' : '2rem'};
    }
    
    h3 {
      color: white;
      text-transform: uppercase;
      font-size: ${props => props.isMobile ? '1.2rem' : '1.5rem'};
      margin: 0;
    }
  }

  .mobile-user-avatar {
    img {
      height: 2.5rem;
      width: 2.5rem;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #9a86f3;
    }
  }

  .contacts-container {
    overflow: hidden;
    position: relative;
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    height: 100%;
    gap: 0.8rem;
    padding: ${props => props.isMobile ? '0.5rem 0.3rem 1rem' : '1rem 0'};
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #2d2d3d;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #555;
      border-radius: 3px;
      transition: background 0.2s ease;

      &:hover {
        background: #777;
      }
    }
    
    scrollbar-width: thin;
    scrollbar-color: #555 #2d2d3d;
    
    .contact {
      background-color: #ffffff34;
      min-height: ${props => props.isMobile ? '4rem' : '5rem'};
      cursor: pointer;
      width: ${props => props.isMobile ? '95%' : '90%'};
      border-radius: 0.4rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: all 0.3s ease;
      flex-shrink: 0;
      
      &:hover {
        background-color: #ffffff4d;
      }
      
      &:active {
        transform: scale(0.98);
      }
      
      .avatar {
        img {
          height: ${props => props.isMobile ? '2.5rem' : '3rem'};
          width: ${props => props.isMobile ? '2.5rem' : '3rem'};
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid #9a86f3;
        }
      }
      
      .username {
        h3 {
          color: white;
          font-size: ${props => props.isMobile ? '0.9rem' : '1rem'};
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: ${props => props.isMobile ? '120px' : '150px'};
        }
      }
    }
    
    .selected {
      background-color: #9a86f3;
      &:hover {
        background-color: #9a86f3;
      }
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    padding: 0.5rem;
    
    .avatar {
      img {
        height: 3.5rem;
        width: 3.5rem;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #9a86f3;
      }
    }
    
    .username {
      h2 {
        color: white;
        font-size: 1.2rem;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 180px;
      }
    }
  }

  @media (max-width: 480px) {
    grid-template-rows: 12% 88%;
    
    .header {
      padding: 0 0.8rem;
      min-height: 50px;
    }
    
    .brand {
      img {
        height: 1.5rem;
      }
      h3 {
        font-size: 1rem;
      }
    }
    
    .mobile-user-avatar img {
      height: 2.2rem;
      width: 2.2rem;
    }
    
    .contacts {
      padding: 0.3rem 0.2rem 1rem;
      gap: 0.6rem;
      
      .contact {
        min-height: 3.5rem;
        width: 97%;
        padding: 0.3rem;
        gap: 0.8rem;
        
        .avatar img {
          height: 2.2rem;
          width: 2.2rem;
        }
        
        .username h3 {
          font-size: 0.8rem;
          max-width: 100px;
        }
      }
    }
  }
`;