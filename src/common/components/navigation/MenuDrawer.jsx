import React, { useState } from 'react';

import 'App.css';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Hamburger = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 2001;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.1);
  z-index: 2000;
`;

const Drawer = styled.div`
  position: fixed;
  top: 16px;
  left: 16px;
  width: 260px;
  background: var(--lighest-grey);
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  padding: 18px 0;
  z-index: 2002;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 16px 24px;
  border-radius: 14px;
  cursor: pointer;
  background: ${({ active }) => (active ? 'var(--light-grey)' : 'none')};
  border: ${({ active }) =>
    active ? '2px solid var(--lighter-grey)' : '2px solid transparent'};
  transition:
    background 0.2s,
    border 0.2s;

  &:hover {
    background: var(--light-grey);
  }
`;

const icons = {
  Dashboard: (
    <span role='img' aria-label='home'>
      🏠
    </span>
  ),
  Database: (
    <span role='img' aria-label='database'>
      🗄️
    </span>
  ),
  Calendar: (
    <span role='img' aria-label='calendar'>
      📅
    </span>
  ),
  'My Account': (
    <span role='img' aria-label='account'>
      👤
    </span>
  ),
  'Admin Dashboard': (
    <span role='img' aria-label='admin'>
      🛠️
    </span>
  ),
  Billing: (
    <span role='img' aria-label='billing'>
      💳
    </span>
  ),
};

const menuTabs = [
  { label: 'Dashboard', to: '/admin-dashboard' },
  { label: 'Database', to: '/participant-database' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'My Account', to: '/account' },
  { label: 'Admin Dashboard', to: '/admin' },
  { label: 'Billing', to: '/billing' },
];

export default function MenuDrawer() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuClick = (to) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <>
      <Hamburger onClick={() => setOpen(true)} title='Open menu'>
        <span role='img' aria-label='menu'>
          ☰
        </span>
      </Hamburger>
      {open && <Overlay onClick={() => setOpen(false)} />}
      {open && (
        <Drawer>
          {menuTabs.map((tab) => (
            <MenuItem
              key={tab.to}
              active={location.pathname === tab.to}
              onClick={() => handleMenuClick(tab.to)}
            >
              {icons[tab.label] || '•'}
              <span className='text-body'>{tab.label}</span>
            </MenuItem>
          ))}
        </Drawer>
      )}
    </>
  );
}
