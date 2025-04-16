import React from 'react';
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

export default function HomeButton() {
  return (
    <HomeButtonContainer>
      <StyledLink to="/">Home</StyledLink>
    </HomeButtonContainer>
  );
}

// Styled components
const HomeButtonContainer = styled.div`
  position: fixed; /* Fixed position to stay in place */
  top: 20px; /* Distance from the top */
  left: 20px; /* Distance from the left */
  z-index: 1000; /* Ensure it's above other content */
`;

const StyledLink = styled(RouterLink)`
  display: inline-block;
  padding: 10px 20px;
  background-color: rgb(0, 86, 150); /* Blue background */
  color: white; /* White text */
  text-decoration: none; /* Remove underline */
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px; /* Rounded corners */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Subtle shadow */
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3; /* Darker blue on hover */
  }

  &:active {
    background-color: #004080; /* Even darker blue on click */
  }
`;