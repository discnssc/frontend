import React from 'react';

import styled from 'styled-components';

const NavbarContainer = styled.nav`
  width: 1312px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 40px;
  background: #d9d9d9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  font-family: 'Roboto', sans-serif;
`;

const NavItem = styled.div`
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  padding: 8px 12px;
`;

export default function Navbar() {
  return (
    <NavbarContainer>
      <NavItem>General Info</NavItem>
      <NavItem>Demographics</NavItem>
      <NavItem>HOW Info</NavItem>
      <NavItem>Cases/Services</NavItem>
      <NavItem>Activity Logs</NavItem>
    </NavbarContainer>
  );
}