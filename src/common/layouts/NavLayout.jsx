import React from 'react';

import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const Layout = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export default function NavLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
