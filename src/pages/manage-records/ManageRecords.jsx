import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Button } from 'common/components/Button';
import AdminNavBar from 'common/components/navigation/AdminNavBar';
import MenuDrawer from 'common/components/navigation/MenuDrawer';

import CreateParticipantModal from './CreateParticipantModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import FilterDropdown from './FilterDropdown';
import ManageRecordsTable from './ManageRecordsTable';
import SortDropdownComponent from './SortDropdown';

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

const CreateButton = styled(Button.Primary)`
  height: 48px;
  font-size: 1.1rem;
  border-radius: 8px;
  margin-left: 8px;
  color: #fff;
`;

const FilterButton = styled.button`
  padding: 14px 18px;
  border-radius: 24px;
  border: 1px solid #d9d9d9;
  background: #fff;
  font-size: 1rem;
  min-width: 180px;
  cursor: pointer;
  position: relative;
  z-index: 10;
`;

const SortButton = styled.button`
  padding: 14px 18px;
  border-radius: 24px;
  border: 1px solid #d9d9d9;
  background: #fff;
  font-size: 1rem;
  min-width: 180px;
  cursor: pointer;
  position: relative;
  z-index: 10;
`;

export default function ManageRecords() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newStatus, setNewStatus] = useState('Active');
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    participant: null,
  });
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [hoveredFilter, setHoveredFilter] = useState(null);
  const [caregivers, setCaregivers] = useState([]);
  const [caregiverSearch, setCaregiverSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState({ type: null, value: null });
  const [sortBy, setSortBy] = useState('lastName');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  useEffect(() => {
    fetchParticipants();
    fetchCaregivers();
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

  async function fetchCaregivers() {
    const res = await fetch(`${API_BASE_URL}/participants`, {
      credentials: 'include',
    });
    const allParticipants = await res.json();

    setCaregivers(
      allParticipants
        .filter(
          (p) =>
            p.participant_general_info?.type === 'Care Partner' &&
            (p.participant_general_info?.first_name ||
              p.participant_general_info?.last_name)
        )
        .map((p) => ({
          id: p.id,
          name: `${p.participant_general_info?.first_name || ''} ${p.participant_general_info?.last_name || ''}`.trim(),
        }))
    );
  }

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

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      !search ||
      p.participant_general_info?.first_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      p.participant_general_info?.last_name
        ?.toLowerCase()
        .includes(search.toLowerCase());
    let matchesCaregiver = true;
    if (activeFilter.type === 'caregiver' && activeFilter.value) {
      matchesCaregiver = (p.carepartners || []).some(
        (cp) => cp.carepartner?.id === activeFilter.value
      );
    }
    let matchesStatus = true;
    if (activeFilter.type === 'status' && activeFilter.value) {
      matchesStatus =
        (p.participant_general_info?.status || '').toLowerCase() ===
        activeFilter.value.toLowerCase();
    }
    return matchesSearch && matchesCaregiver && matchesStatus;
  });

  const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    if (sortBy === 'lastName') {
      const aLast = a.participant_general_info?.last_name?.toLowerCase() || '';
      const bLast = b.participant_general_info?.last_name?.toLowerCase() || '';
      return aLast.localeCompare(bLast);
    } else if (sortBy === 'active') {
      const aActive = a.participant_general_info?.status === 'Active' ? 0 : 1;
      const bActive = b.participant_general_info?.status === 'Active' ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      const aLast = a.participant_general_info?.last_name?.toLowerCase() || '';
      const bLast = b.participant_general_info?.last_name?.toLowerCase() || '';
      return aLast.localeCompare(bLast);
    }
    return 0;
  });

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
            <div style={{ position: 'relative' }}>
              <FilterButton
                onClick={() => setFilterDropdownOpen((open) => !open)}
                onBlur={() =>
                  setTimeout(() => setFilterDropdownOpen(false), 200)
                }
              >
                {activeFilter.type
                  ? activeFilter.type === 'caregiver'
                    ? `Caregiver: ${caregivers.find((c) => c.id === activeFilter.value)?.name || ''}`
                    : `Status: ${activeFilter.value}`
                  : 'Filter By: None'}
              </FilterButton>
              <FilterDropdown
                isOpen={filterDropdownOpen}
                onClose={() => setFilterDropdownOpen(false)}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                caregivers={caregivers}
                caregiverSearch={caregiverSearch}
                onCaregiverSearchChange={(e) =>
                  setCaregiverSearch(e.target.value)
                }
                hoveredFilter={hoveredFilter}
                onHoverFilter={setHoveredFilter}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <SortButton
                onClick={() => setSortDropdownOpen((open) => !open)}
                onBlur={() => setTimeout(() => setSortDropdownOpen(false), 200)}
              >
                {sortBy === 'lastName'
                  ? 'Sort By: Last Name'
                  : 'Sort By: Active'}
              </SortButton>
              <SortDropdownComponent
                isOpen={sortDropdownOpen}
                onClose={() => setSortDropdownOpen(false)}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
            <CreateButton onClick={() => setModalOpen(true)}>
              + Create New
            </CreateButton>
          </RightControls>
        </FilterRow>
        <ManageRecordsTable
          participants={sortedParticipants}
          loading={loading}
          error={error}
          onDeleteClick={openDeleteModal}
          onStatusToggle={handleToggleStatus}
        />
        <CreateParticipantModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateParticipant}
          firstName={newFirstName}
          lastName={newLastName}
          status={newStatus}
          onFirstNameChange={(e) => setNewFirstName(e.target.value)}
          onLastNameChange={(e) => setNewLastName(e.target.value)}
          onStatusChange={(e) => setNewStatus(e.target.value)}
        />
        <DeleteConfirmModal
          isOpen={deleteModal.open}
          onClose={closeDeleteModal}
          onConfirm={confirmDeleteParticipant}
          participant={deleteModal.participant}
        />
      </Content>
    </Container>
  );
}
