import React from 'react';
import styled from 'styled-components';
import { Link as RouterLink, useParams} from "react-router-dom";

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
`;

const StyledLink = styled(RouterLink)`
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  text-decoration: none;
  line-height: normal;
  padding: 8px 12px;
`;

export default function ParticipantNavbar() {
  const { id } = useParams();
  return (
    <NavbarContainer>
      <StyledLink to={`/participant/generalinfo/${id}`}>General Info</StyledLink>
      <StyledLink to={`/participant/demographics/${id}`}>Demographics</StyledLink>
      <StyledLink to={`/participant/howinfo/${id}`}>HOW Info</StyledLink>
      <StyledLink to={`/participant/cases/${id}`}>Cases/Services</StyledLink>
      <StyledLink to={`/participant/activities/${id}`}>Activity Logs</StyledLink>
    </NavbarContainer>
  );
}
