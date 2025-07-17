import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import FilterDropdown from 'pages/manage-records/FilterDropdown';
import SortDropdownComponent from 'pages/manage-records/SortDropdown';

// Styled-components copied from ManageRecords for consistency
const Container = styled.div`
  background: #f2f2f2;
  min-height: 100vh;
  padding-bottom: 6%;
  padding-top: 6%;
`;

const Content = styled.div`
  max-width: 100%;
  margin: 0;
  padding: 0 12px;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 16px;
  margin-top: -21px;
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 18px;
  width: 100%;
`;

const SearchContainer = styled.div`
  flex: 1 1 0%;
  display: flex;
  align-items: center;
  min-width: 0;
`;

const RightControls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex: 1 1 0%;
  justify-content: flex-end;
  min-width: 0;
`;

const SearchInput = styled.input`
  padding: 15px 18px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  font-size: 15px;
  background: #fff;
  flex: 1 1 0%;
  min-width: 0;
  outline: none;
`;

const FilterButton = styled.button`
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  background: #fff;
  font-size: 15px;
  min-width: 120px;
  height: 49px;
  cursor: pointer;
  position: relative;
  z-index: 10;
`;

const SortButton = styled.button`
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  background: #fff;
  font-size: 15px;
  min-width: 120px;
  height: 49px;
  cursor: pointer;
  position: relative;
  z-index: 10;
`;

export default function ParticipantDatabase() {
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noDataReason, setNoDataReason] = useState('');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [hoveredFilter, setHoveredFilter] = useState(null);
  const [caregivers, setCaregivers] = useState([]);
  const [caregiverSearch, setCaregiverSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState({ type: null, value: null });
  const [sortBy, setSortBy] = useState('lastName');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchParticipants = async () => {
      setIsLoading(true);
      try {
        const baseUrl = process.env.REACT_APP_BACKEND_URL;
        const apiUrl = `${baseUrl}/participants`;
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        const formattedData = data.map((participant) => ({
          id: participant.id,
          first_name: participant.participant_general_info?.first_name,
          last_name: participant.participant_general_info?.last_name,
          status: participant.participant_general_info?.status,
          participant_updated_at: participant.participant_updated_at,
          care_giver:
            participant.carepartners?.length > 0
              ? `${participant.carepartners[0].carepartner?.participant_general_info?.first_name || ''} ${participant.carepartners[0].carepartner?.participant_general_info?.last_name || ''}`.trim()
              : null,
          carepartners: participant.carepartners || [],
        }));
        setParticipants(formattedData);
        // Extract caregivers for filter dropdown
        const caregiversList = [];
        data.forEach((p) => {
          if (
            p.participant_general_info?.type === 'Care Partner' &&
            (p.participant_general_info?.first_name ||
              p.participant_general_info?.last_name)
          ) {
            caregiversList.push({
              id: p.id,
              name: `${p.participant_general_info?.first_name || ''} ${p.participant_general_info?.last_name || ''}`.trim(),
            });
          }
        });
        setCaregivers(caregiversList);
        if (formattedData.length === 0) {
          setNoDataReason('No participants found in database');
        }
        setError(null);
      } catch (error) {
        setError(`Failed to load participants: ${error.message}`);
        setParticipants([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchParticipants();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtering logic (matches ManageRecords)
  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesCaregiver = true;
    if (activeFilter.type === 'caregiver' && activeFilter.value) {
      matchesCaregiver = (p.carepartners || []).some(
        (cp) => cp.carepartner?.id === activeFilter.value
      );
    }
    let matchesStatus = true;
    if (activeFilter.type === 'status' && activeFilter.value) {
      matchesStatus =
        (p.status || '').toLowerCase() === activeFilter.value.toLowerCase();
    }
    return matchesSearch && matchesCaregiver && matchesStatus;
  });

  // Sorting logic (matches ManageRecords)
  const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    if (sortBy === 'lastName') {
      const aLast = a.last_name?.toLowerCase() || '';
      const bLast = b.last_name?.toLowerCase() || '';
      return aLast.localeCompare(bLast);
    } else if (sortBy === 'active') {
      const aActive = a.status === 'Active' ? 0 : 1;
      const bActive = b.status === 'Active' ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      const aLast = a.last_name?.toLowerCase() || '';
      const bLast = b.last_name?.toLowerCase() || '';
      return aLast.localeCompare(bLast);
    }
    return 0;
  });

  const getEmptyStateMessage = () => {
    if (searchTerm) {
      return 'No matching participants found';
    }
    if (noDataReason) {
      return noDataReason;
    }
    return 'No participants available';
  };

  return (
    <Container>
      <Content>
        <Title>Participant Database</Title>
        <FilterRow>
          <SearchContainer>
            <SearchInput
              placeholder='Search...'
              value={searchTerm}
              onChange={handleSearchChange}
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
          </RightControls>
        </FilterRow>

        <div className='table-container'>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              borderRadius: '10px',
              overflow: 'hidden',
              fontSize: '15px',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#005696',
                }}
              >
                <th
                  style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: 'normal',
                    color: 'white',
                  }}
                >
                  First Name
                </th>
                <th
                  style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: 'normal',
                    color: 'white',
                  }}
                >
                  Last Name
                </th>
                <th
                  style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: 'normal',
                    color: 'white',
                  }}
                >
                  Caregiver
                </th>
                <th
                  style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: 'normal',
                    color: 'white',
                  }}
                >
                  Last Updated
                </th>
                <th
                  style={{
                    padding: '15px',
                    textAlign: 'left',
                    fontWeight: 'normal',
                    color: 'white',
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr style={{ backgroundColor: 'white' }}>
                  <td
                    colSpan='5'
                    style={{ padding: '20px', textAlign: 'center' }}
                  >
                    Loading Participants...
                  </td>
                </tr>
              ) : error ? (
                <tr style={{ backgroundColor: 'white' }}>
                  <td
                    colSpan='5'
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: '#dc3545',
                    }}
                  >
                    {error}
                  </td>
                </tr>
              ) : sortedParticipants.length > 0 ? (
                sortedParticipants.map((participant, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    <td style={{ padding: '15px' }}>
                      <Link to={`/participant/generalinfo/${participant.id}`}>
                        {participant.first_name}
                      </Link>
                    </td>
                    <td style={{ padding: '15px' }}>{participant.last_name}</td>
                    <td style={{ padding: '15px' }}>
                      {participant.care_giver}
                    </td>
                    <td style={{ padding: '15px' }}>
                      {participant.participant_updated_at
                        ? new Date(
                            participant.participant_updated_at
                          ).toLocaleString()
                        : 'N/A'}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div
                        style={{
                          display: 'inline-block',
                          backgroundColor:
                            participant.status?.toLowerCase() === 'inactive'
                              ? '#f8d7da'
                              : '#d4edda',
                          color:
                            participant.status?.toLowerCase() === 'inactive'
                              ? '#721c24'
                              : '#155724',
                          padding: '5px 15px',
                          borderRadius: '25px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          minWidth: '80px',
                        }}
                      >
                        {participant.status}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr style={{ backgroundColor: 'white' }}>
                  <td
                    colSpan='5'
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: '#6c757d',
                    }}
                  >
                    {getEmptyStateMessage()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Content>
    </Container>
  );
}
