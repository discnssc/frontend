import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from 'common/components/Button';
import AdminNavBar from 'common/components/navigation/AdminNavBar';
import MenuDrawer from 'common/components/navigation/MenuDrawer';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const Container = styled.div`
  background: #f2f2f2;
  min-height: 100vh;
  padding-bottom: 6%;
  padding-top: 6%;
`;
const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;
const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 16px;
  margin-top: 24px;
`;
const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 18px;
`;
const SearchContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;
const RightControls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;
const SearchInput = styled.input`
  padding: 14px 18px;
  border-radius: 24px;
  border: 1px solid #d9d9d9;
  font-size: 1rem;
  background: #fff;
  min-width: 260px;
  outline: none;
`;
const Select = styled.select`
  padding: 14px 18px;
  border-radius: 24px;
  border: 1px solid #d9d9d9;
  font-size: 1rem;
  background: #fff;
  min-width: 180px;
  outline: none;
`;
const CreateButton = styled(Button.Primary)`
  height: 48px;
  font-size: 1.1rem;
  border-radius: 8px;
  margin-left: 8px;
`;
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
  background: #ffe6b3;
  color: #b8860b;
`;
// Status Toggle Styles
const StatusToggle = styled.div`
  display: flex;
  border-radius: 999px;
  overflow: visible;
  width: 180px;
  height: 20px;
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
  font-size: 1.25rem;
  font-weight: 500;
  cursor: ${({ selected }) => (selected ? 'default' : 'pointer')};
  border-radius: 999px;
  margin: 0 2px;
  padding: 10px 0 10px 0;
  box-shadow: ${({ selected }) =>
    selected ? '0 2px 8px rgba(0,0,0,0.10)' : 'none'};
  border: ${({ selected }) => (selected ? '3px solid #fff' : 'none')};
  z-index: ${({ selected }) => (selected ? 1 : 0)};
  transition:
    background 0.18s,
    color 0.18s,
    box-shadow 0.18s,
    border 0.18s,
    transform 0.18s;
  transform: ${({ selected }) => (selected ? 'scale(1.07)' : 'scale(1)')};
`;
// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;
const ModalTitle = styled.h2`
  margin-top: 0;
`;
const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  font-size: 1rem;
`;
const ModalSelect = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  font-size: 1rem;
`;
const ModalButton = styled(Button.Primary)`
  width: 100%;
  margin-top: 8px;
`;
const ModalClose = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
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
const ConfirmModalOverlay = ModalOverlay;
const ConfirmModalContent = styled(ModalContent)`
  text-align: center;
  padding: 2.5rem 2rem 2rem 2rem;
`;
const ConfirmName = styled.div`
  font-weight: bold;
  font-size: 1.3rem;
  margin: 12px 0 8px 0;
`;
const ConfirmButton = styled(Button.Primary)`
  width: 140px;
  font-size: 1.1rem;
  margin: 0 18px 0 0;
  display: inline-block;
`;
const CancelButton = styled.button`
  background: none;
  border: none;
  color: #005696;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 8px;
`;

export default function ManageRecords() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newStatus, setNewStatus] = useState('Active');

  // For search/filter/sort (not functional yet)
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    participant: null,
  });

  useEffect(() => {
    fetchParticipants();
  }, []);

  function fetchParticipants() {
    setLoading(true);
    fetch(`${API_BASE_URL}/participants`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch participants');
        return res.json();
      })
      .then((data) => setParticipants(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  // Create new participant
  async function handleCreateParticipant(e) {
    e.preventDefault();
    const payload = {
      participant_general_info: {
        first_name: newFirstName,
        last_name: newLastName,
        status: newStatus,
        type: 'Participant',
      },
    };
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/participants/${crypto.randomUUID()}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error('Failed to create participant');
      setModalOpen(false);
      setNewFirstName('');
      setNewLastName('');
      setNewStatus('Active');
      fetchParticipants();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Toggle status
  async function handleToggleStatus(participant, newStatus) {
    const payload = {
      participant_general_info: {
        ...participant.participant_general_info,
        status: newStatus,
      },
    };
    try {
      const res = await fetch(
        `${API_BASE_URL}/participants/${participant.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error('Failed to update status');
      // Update local state instead of refetching
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === participant.id
            ? {
                ...p,
                participant_general_info: {
                  ...p.participant_general_info,
                  status: newStatus,
                },
              }
            : p
        )
      );
    } catch (err) {
      alert(err.message);
    }
  }

  function openDeleteModal(participant) {
    setDeleteModal({ open: true, participant });
  }

  function closeDeleteModal() {
    setDeleteModal({ open: false, participant: null });
  }

  async function confirmDeleteParticipant() {
    const id = deleteModal.participant.id;
    try {
      await fetch(`${API_BASE_URL}/participants/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setParticipants((prev) => prev.filter((p) => p.id !== id));
      closeDeleteModal();
    } catch (err) {
      alert('Failed to delete participant');
      closeDeleteModal();
    }
  }

  return (
    <Container>
      <MenuDrawer />
      <Content>
        <Title>Admin Dashboard</Title>
        <AdminNavBar />
        <FilterRow>
          <SearchContainer>
            <SearchInput
              placeholder='Search…'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchContainer>
          <RightControls>
            <Select>
              <option>Filter By: None</option>
            </Select>
            <Select>
              <option>Sort By: Last Name</option>
            </Select>
            <CreateButton onClick={() => setModalOpen(true)}>
              + Create New
            </CreateButton>
          </RightControls>
        </FilterRow>
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
              {loading ? (
                <tr>
                  <Td colSpan={5}>Loading…</Td>
                </tr>
              ) : error ? (
                <tr>
                  <Td colSpan={5} style={{ color: 'red' }}>
                    Error: {error}
                  </Td>
                </tr>
              ) : participants.length === 0 ? (
                <tr>
                  <Td colSpan={5} style={{ color: '#888' }}>
                    No records found.
                  </Td>
                </tr>
              ) : (
                participants.map((p) => {
                  const status =
                    p.participant_general_info?.status === 'Active'
                      ? 'Active'
                      : 'Inactive';
                  return (
                    <tr key={p.id}>
                      <Td>
                        <DeleteButton
                          onClick={() => openDeleteModal(p)}
                          title='Delete'
                        >
                          <span aria-hidden='true'>−</span>
                        </DeleteButton>
                      </Td>
                      <Td>
                        <NameLink
                          onClick={() =>
                            navigate(`/participant/generalinfo/${p.id}`)
                          }
                        >
                          {p.participant_general_info?.first_name || ''}
                        </NameLink>
                      </Td>
                      <Td>
                        <NameLink
                          onClick={() =>
                            navigate(`/participant/generalinfo/${p.id}`)
                          }
                        >
                          {p.participant_general_info?.last_name || ''}
                        </NameLink>
                      </Td>
                      <Td>
                        <RecordTypeBadge>Participant</RecordTypeBadge>
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
                              status !== 'Active' &&
                              handleToggleStatus(p, 'Active')
                            }
                          >
                            Active
                          </ToggleSide>
                          <ToggleSide
                            type='button'
                            selected={status === 'Inactive'}
                            active={false}
                            onClick={() =>
                              status !== 'Inactive' &&
                              handleToggleStatus(p, 'Inactive')
                            }
                          >
                            Inactive
                          </ToggleSide>
                        </StatusToggle>
                      </Td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </TableWrapper>
        {/* Modal for creating new participant */}
        {modalOpen && (
          <ModalOverlay>
            <ModalContent>
              <ModalClose onClick={() => setModalOpen(false)} title='Close'>
                ×
              </ModalClose>
              <ModalTitle>Create New Participant</ModalTitle>
              <form onSubmit={handleCreateParticipant}>
                <ModalInput
                  placeholder='First Name'
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  required
                />
                <ModalInput
                  placeholder='Last Name'
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  required
                />
                <ModalSelect
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value='Active'>Active</option>
                  <option value='Inactive'>Inactive</option>
                </ModalSelect>
                <ModalButton type='submit'>Create</ModalButton>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
        {deleteModal.open && (
          <ConfirmModalOverlay>
            <ConfirmModalContent>
              <div style={{ fontSize: '1.15rem', marginBottom: 8 }}>
                You are about to delete
                <br />
                all participant info for:
              </div>
              <ConfirmName>
                {deleteModal.participant.participant_general_info?.first_name}{' '}
                {deleteModal.participant.participant_general_info?.last_name}
              </ConfirmName>
              <div style={{ marginBottom: 24 }}>
                This action cannot be undone.
              </div>
              <ConfirmButton onClick={confirmDeleteParticipant}>
                Confirm
              </ConfirmButton>
              <CancelButton onClick={closeDeleteModal}>Cancel</CancelButton>
            </ConfirmModalContent>
          </ConfirmModalOverlay>
        )}
      </Content>
    </Container>
  );
}
