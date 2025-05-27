import React from 'react';

import {
  Table,
  TableCell,
  TableContainer,
  TableHeaderCell,
  TableRow,
} from 'common/components/tables/Tables';

import { InlayContainer } from './styles';

export default function ManageUsers() {
  return (
    <InlayContainer>
      <div className='text-subheading'>Registered Users</div>

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
      <div className='text-subheading'>Invite New User</div>
      <div className='text-subheading'>Pending Invites</div>

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
  );
}
