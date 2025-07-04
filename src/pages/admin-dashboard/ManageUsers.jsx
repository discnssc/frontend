import React, { useEffect, useState } from 'react';

import AdminNavBar from 'common/components/navigation/AdminNavBar';
import MenuDrawer from 'common/components/navigation/MenuDrawer';
import {
  Table,
  TableCell,
  TableContainer,
  TableHeaderCell,
  TableRow,
} from 'common/components/tables/Tables';

import { InlayContainer, PageContainer } from './styles';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  //   const [searchTerm, setSearchTerm] = useState('');
  //   const [isLoading, setIsLoading] = useState(true);
  //   const [error, setError] = useState(null);
  //   const [noDataReason, setNoDataReason] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      //   setIsLoading(true);
      try {
        const baseUrl = process.env.REACT_APP_BACKEND_URL;
        console.log(`Fetching participants from ${baseUrl}/users`);
        const response = await fetch(`${baseUrl}/users`, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Send cookies if authentication is needed
        });
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
          //   setNoDataReason('No participants found in database');
        }
        // setError(null);
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        // setError(`Failed to load users: ${error.message}`);
        setUsers([]);
      } finally {
        // setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <PageContainer>
      <MenuDrawer />
      <InlayContainer>
        <div
          className='text-title'
          style={{
            marginBottom: -14,
            marginTop: 24,
            fontSize: '2.2rem',
            fontWeight: 'bold',
          }}
        >
          Admin Dashboard
        </div>
        <AdminNavBar />
        <div className='text-subheading' style={{ marginBottom: 24 }}>
          Registered Users
        </div>
        <TableContainer>
          <Table>
            <TableRow>
              <TableHeaderCell>First Name</TableHeaderCell>
              <TableHeaderCell>Last Name</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
            </TableRow>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.firstname}</TableCell>
                <TableCell>{user.lastname}</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </Table>
        </TableContainer>
        <div
          className='text-subheading'
          style={{ marginTop: 40, marginBottom: 16 }}
        >
          Invite New User
        </div>
        {/* Add invite form here if needed */}
        <div
          className='text-subheading'
          style={{ marginTop: 40, marginBottom: 16 }}
        >
          Pending Invites
        </div>
        <TableContainer>
          <Table>
            <TableRow>
              <TableHeaderCell>First Name</TableHeaderCell>
              <TableHeaderCell>Last Name</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
            </TableRow>
            <TableRow>
              <TableCell>John</TableCell>
              <TableCell>Doe</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>john@example.com</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>John</TableCell>
              <TableCell>Doe</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>john@example.com</TableCell>
            </TableRow>
          </Table>
        </TableContainer>
      </InlayContainer>
    </PageContainer>
  );
}
