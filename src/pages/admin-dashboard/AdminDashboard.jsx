import React from 'react';

import { Outlet } from 'react-router-dom';

import { PageContainer } from './styles';

export default function AdminDashboard() {
  return (
    <PageContainer>
      <Outlet />
    </PageContainer>
  );
}
