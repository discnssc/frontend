// This is the admin navigation bar that is used to navigate the admin pages
// Not the three lines in the top left corner

import React from 'react';
import NavBar from './NavBar';

const adminTabs = [
  { label: 'Manage Users', to: '/admin/manage-users', end: true },
  { label: 'Manage Records', to: '/admin/manage-records' },
  { label: 'Activity Schedule', to: '/admin/activity-schedule' },
  { label: 'Participant Schedule', to: '/admin/participant-schedule' },
  { label: 'Staff Schedule', to: '/admin/staff-schedule' },
];

export default function AdminNavBar() {
  return <NavBar tabs={adminTabs} />;
}
