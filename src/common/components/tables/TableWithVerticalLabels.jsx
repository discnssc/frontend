/* eslint-disable react/prop-types */
import React from 'react';

import styled from 'styled-components';

const Table = styled.table`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  border-collapse: collapse;
  table-layout: ${({ fullWidth }) => (fullWidth ? 'auto' : 'fixed')};
  vertical-align: top;
  overflow: hidden;

  tbody tr:last-child td:first-child {
    border-bottom-left-radius: 10px;
  }
  tbody tr:last-child td:last-child {
    border-bottom-right-radius: 10px;
  }
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
const TableWithVerticalLabels = ({ data, columns, error, fullWidth }) => {
  console.log('error:', error);
  return (
    <ScrollableTableWrapper>
      <Table fullWidth={fullWidth}>
        <TableRow>
          {columns.map((col) => (
            <LableTableCell key={col.key}>{col.label}</LableTableCell>
          ))}
        </TableRow>
        <tbody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                style={{ textAlign: 'center' }}
              >
                {error || 'No data available at the moment'}
              </TableCell>
            </TableRow>
          ) : (
            data.map((entry) => (
              <TableRow key={entry.entry_id || entry.id}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(entry) : (entry[col.key] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </tbody>
      </Table>
    </ScrollableTableWrapper>
  );
};
export default TableWithVerticalLabels;
