import React from 'react';

import { Outlet } from 'react-router-dom';

import AdminNavBar from 'common/components/navigation/AdminNavBar';

import { PageContainer } from './styles';

export default function AdminDashboard() {
  return (
    <PageContainer>
      <h1 className='text-title'>Admin Dashboard</h1>
      <AdminNavBar />
      <Outlet />
    </PageContainer>
  );
}
