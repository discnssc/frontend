import React from 'react';

import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const TableWrapper = styled.div`
  margin-top: 18px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Th = styled.th`
  background: #005696;
  color: white;
  padding: 18px 8px;
  font-size: 1rem;
  font-weight: bold;
  text-align: left;
`;

const Td = styled.td`
  background: white;
  padding: 16px 8px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 1rem;
`;

const RecordTypeBadge = styled.span`
  display: inline-block;
  padding: 6px 18px;
  border-radius: 16px;
  font-size: 0.95em;
  font-weight: 500;
  background: ${({ type }) =>
    type === 'Care Partner' ? '#e3d0f7' : '#ffe6b3'};
  color: ${({ type }) => (type === 'Care Partner' ? '#7c3aed' : '#b8860b')};
`;

const StatusToggle = styled.div`
  display: flex;
  border-radius: 999px;
  overflow: visible;
  width: 180px;
  height: 36px;
  background: ${({ active }) => (active ? '#cde7d3' : '#f3d3d3')};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  align-items: center;
  padding: 4px;
`;

const ToggleSide = styled.button`
  flex: 1;
  border: none;
  outline: none;
  background: ${({ selected, active }) =>
    selected ? (active ? '#5b8f6a' : '#b97a7a') : 'transparent'};
  color: ${({ selected, active }) =>
    selected ? '#fff' : active ? '#40694d' : '#8a5a5a'};
  font-size: 0.95rem;
  font-weight: 500;
  cursor: ${({ selected }) => (selected ? 'default' : 'pointer')};
  border-radius: 999px;
  margin: 0 2px;
  height: 100%;
  box-shadow: ${({ selected }) =>
    selected ? '0 2px 8px rgba(0,0,0,0.10)' : 'none'};
  border: ${({ selected }) => (selected ? '1px solid #fff' : 'none')};
  z-index: ${({ selected }) => (selected ? 1 : 0)};
  transition:
    background 0.18s,
    color 0.18s,
    box-shadow 0.18s,
    border 0.18s,
    transform 0.18s;
  transform: ${({ selected }) => (selected ? 'scale(1.01)' : 'scale(1)')};
`;

const NameLink = styled.button`
  background: none;
  border: none;
  color: #005696;
  text-decoration: underline;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  margin: 0;
`;

const DeleteButton = styled.button`
  background: #ef4444;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background 0.18s;
  margin-right: 4px;
  &:hover {
    background: #dc2626;
  }
`;

export default function ManageRecordsTable({
  participants,
  loading,
  error,
  onDeleteClick,
  onStatusToggle,
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <TableWrapper>
        <Table>
          <tbody>
            <tr>
              <Td colSpan={6}>Loading…</Td>
            </tr>
          </tbody>
        </Table>
      </TableWrapper>
    );
  }

  if (error) {
    return (
      <TableWrapper>
        <Table>
          <tbody>
            <tr>
              <Td colSpan={6} style={{ color: 'red' }}>
                Error: {error}
              </Td>
            </tr>
          </tbody>
        </Table>
      </TableWrapper>
    );
  }

  if (participants.length === 0) {
    return (
      <TableWrapper>
        <Table>
          <tbody>
            <tr>
              <Td colSpan={6} style={{ color: '#888' }}>
                No records found.
              </Td>
            </tr>
          </tbody>
        </Table>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <Th></Th>
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>Record Type</Th>
            <Th>Date Created</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p) => {
            const status =
              p.participant_general_info?.status === 'Active'
                ? 'Active'
                : 'Inactive';
            return (
              <tr key={p.id}>
                <Td>
                  <DeleteButton onClick={() => onDeleteClick(p)} title='Delete'>
                    <span aria-hidden='true'>−</span>
                  </DeleteButton>
                </Td>
                <Td>
                  <NameLink
                    onClick={() => navigate(`/participant/generalinfo/${p.id}`)}
                  >
                    {p.participant_general_info?.first_name || ''}
                  </NameLink>
                </Td>
                <Td>
                  <NameLink
                    onClick={() => navigate(`/participant/generalinfo/${p.id}`)}
                  >
                    {p.participant_general_info?.last_name || ''}
                  </NameLink>
                </Td>
                <Td>
                  <RecordTypeBadge type={p.participant_general_info?.type}>
                    {p.participant_general_info?.type === 'Care Partner'
                      ? 'Care Partner'
                      : 'Participant'}
                  </RecordTypeBadge>
                </Td>
                <Td>
                  {p.participant_created_at
                    ? new Date(p.participant_created_at).toLocaleString(
                        'en-US',
                        {
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        }
                      )
                    : ''}
                </Td>
                <Td>
                  <StatusToggle active={status === 'Active'}>
                    <ToggleSide
                      type='button'
                      selected={status === 'Active'}
                      active={true}
                      onClick={() =>
                        status !== 'Active' && onStatusToggle(p, 'Active')
                      }
                    >
                      Active
                    </ToggleSide>
                    <ToggleSide
                      type='button'
                      selected={status === 'Inactive'}
                      active={false}
                      onClick={() =>
                        status !== 'Inactive' && onStatusToggle(p, 'Inactive')
                      }
                    >
                      Inactive
                    </ToggleSide>
                  </StatusToggle>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </TableWrapper>
  );
}

ManageRecordsTable.propTypes = {
  participants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      participant_general_info: PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        status: PropTypes.string,
        type: PropTypes.string,
      }),
      participant_created_at: PropTypes.string,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onDeleteClick: PropTypes.func.isRequired,
  onStatusToggle: PropTypes.func.isRequired,
};

ManageRecordsTable.defaultProps = {
  error: null,
};
