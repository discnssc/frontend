// This is the navigation bar that is used to navigate the pages
// Not the three lines in the top left corner
import React from 'react';

import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  width: 100%;
  height: 75px;
  flex-shrink: 0;
  border-radius: 40px;
  background: #d9d9d9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: sans-serif;
  position: relative;
  z-index: 1;
`;

const StyledNavLink = styled(NavLink)`
  color: #000;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  text-decoration: none;
  line-height: normal;
  padding: 8px 12px;
  position: relative;
  transition: color 0.3s ease;

  &:first-child {
    margin-left: 25px;
  }
  &:last-child {
    margin-right: 25px;
  }
  &.active {
    color: white;
    font-weight: bold;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: calc(100% + 24px);
      height: calc(100% + 16px);
      background-color: var(--primary-blue);
      border-radius: 50px;
      z-index: -1;
    }
  }
`;

const NavBar = React.memo(({ tabs }) => {
  return (
    <NavbarContainer>
      {tabs.map(({ label, to, end }) => (
        <StyledNavLink key={to} to={to} end={end}>
          {label}
        </StyledNavLink>
      ))}
    </NavbarContainer>
  );
});

NavBar.displayName = 'NavBar';

NavBar.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      end: PropTypes.bool,
    })
  ).isRequired,
};

export default NavBar;
