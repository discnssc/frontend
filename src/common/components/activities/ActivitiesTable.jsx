/* eslint-disable react/prop-types */
import React from 'react';

import styled from 'styled-components';

const Table = styled.table`
  width: %auto;
  border-collapse: collapse;
  table-layout: fixed;
  vertical-align: top;
  margin-right: 2rem;
  overflow: hidden;
`;

const TableRow = styled.tr`
  width: 100%;
  font-size: 15px;
`;

const LableTableCell = styled.td`
  padding: 15px;
  text-align: left;
  vertical-align: center;
  background: #005696;
  color: #ffffff;
  justify-content: center;
  flex-shrink: 0;
  font-weight: bold;
  &:not(:last-child) {
    border-right: 0.5px solid #ececec;
  }
  &:first-child {
    border-top-left-radius: 10px;
  }
  &:last-child {
    border-top-right-radius: 10px;
  }
`;
const ScrollableTableWrapper = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;
const TableCell = styled.td`
  padding: 15px;
  text-align: left;
  vertical-align: center;
  background-color: #ffffff;
  border: 0.5px solid #ececec;
  justify-content: center;
  flex-shrink: 0;
`;
const ActivitiesTable = ({ activities }) => {
  return (
    <ScrollableTableWrapper>
      <Table>
        <TableRow>
          <LableTableCell>Activity</LableTableCell>
          <LableTableCell>Declined?</LableTableCell>
          <LableTableCell>Rating</LableTableCell>
          <LableTableCell>Date</LableTableCell>
        </TableRow>
        <tbody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>
                <a
                  href={`/activity/${activity.schedule?.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {activity.schedule?.name || 'No name'}
                </a>
              </TableCell>
              <TableCell>{activity.declined ? 'Yes' : 'No'}</TableCell>
              <TableCell>{activity.rating}</TableCell>
              <TableCell>{activity.date}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </ScrollableTableWrapper>
  );
};
export default ActivitiesTable;
