import React from 'react';
import styled from 'styled-components';
import { NavLink, useParams } from 'react-router-dom';

const NavbarContainer = styled.nav`
  width: 1312px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 40px;
  background: #d9d9d9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: auto;
  font-family: sans-serif;
  position: relative; /* Ensure the navbar is a positioning context */
  z-index: 1; /* Ensure the navbar is above the oval */
`;

const StyledNavLink = styled(NavLink)`
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  text-decoration: none;
  line-height: normal;
  padding: 8px 12px;
  position: relative; /* Required for positioning the oval */
  transition: color 0.3s ease;

  &:first-child {
    margin-left: 25px;
  }

  &:last-child {
    margin-right: 25px;
  }

  /* Style for the active link */
  &.active {
    color: white;
    font-weight: bold;

    /* Add the oval background */
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%); /* Center the oval */
      width: calc(100% + 24px); /* Oval width (link width + padding) */
      height: calc(100% + 16px); /* Oval height (link height + padding) */
      background-color: rgb(0, 86, 150); /* Oval color */
      border-radius: 50px; /* Make it oval-shaped */
      z-index: -1; /* Place it behind the text */
    }
  }
`;

export default function ParticipantNavbar() {
  const { id } = useParams();
  return (
    <NavbarContainer>
      <StyledNavLink to={`/participant/generalinfo/${id}`} end>
        General Info
      </StyledNavLink>
      <StyledNavLink to={`/participant/demographics/${id}`}>
        Demographics
      </StyledNavLink>
      <StyledNavLink to={`/participant/howinfo/${id}`}>HOW Info</StyledNavLink>
      <StyledNavLink to={`/participant/cases/${id}`}>Cases/Services</StyledNavLink>
      <StyledNavLink to={`/participant/activities/${id}`}>
        Activity Logs
      </StyledNavLink>
    </NavbarContainer>
  );
}