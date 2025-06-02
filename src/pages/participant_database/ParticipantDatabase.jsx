import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import MenuDrawer from 'common/components/navigation/MenuDrawer';

export default function ParticipantDatabase() {
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noDataReason, setNoDataReason] = useState('');
  const [filterRecordType, setFilterRecordType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('last_name');

  useEffect(() => {
    const fetchParticipants = async () => {
      setIsLoading(true);
      try {
        // Connect to backend API endpoint for participants
        const baseUrl = process.env.REACT_APP_BACKEND_URL;
        const apiUrl = `${baseUrl}/participants`;
        console.log('Fetching participants from:', apiUrl);
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Send cookies if authentication is needed
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        console.log('Participants data received:', data);
        // Transform the data to match the expected format
        const formattedData = data.map((participant) => ({
          id: participant.id,
          first_name: participant.participant_general_info?.first_name,
          last_name: participant.participant_general_info?.last_name,
          status: participant.participant_general_info?.status,
          participant_updated_at: participant.participant_updated_at,
          record_type: participant.participant_general_info?.type,
          // Extract care_giver information if available
          // care_giver:
          //   participant.carepartners?.length > 0
          //     ? `${participant.carepartners[0].carepartner?.participant_general_info?.first_name || ''} ${participant.carepartners[0].carepartner?.participant_general_info?.last_name || ''}`.trim()
          //     : null,
        }));

        setParticipants(formattedData);
        if (formattedData.length === 0) {
          setNoDataReason('No participants found in database');
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching participants:', error);
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

  const filteredParticipants = participants.filter((participant) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      participant.first_name?.toLowerCase().includes(searchLower) ||
      participant.last_name?.toLowerCase().includes(searchLower) ||
      participant.record_type?.toLowerCase().includes(searchLower) ||
      participant.status?.toLowerCase().includes(searchLower);

    const matchesRecordType = filterRecordType
      ? participant.record_type?.toLowerCase() === filterRecordType
      : true;

    const matchesStatus = filterStatus
      ? participant.status?.toLowerCase().replace(/['"]/g, '') === filterStatus
      : true;

    return matchesSearch && matchesRecordType && matchesStatus;
  });

  const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    if (sortBy === 'first_name') {
      return a.first_name?.localeCompare(b.first_name || '') || 0;
    } else if (sortBy === 'last_name') {
      return a.last_name?.localeCompare(b.last_name || '') || 0;
    } else if (sortBy === 'participant_updated_at') {
      const dateA = a.participant_updated_at
        ? new Date(a.participant_updated_at).getTime()
        : 0;
      const dateB = b.participant_updated_at
        ? new Date(b.participant_updated_at).getTime()
        : 0;
      return dateB - dateA;
    } else if (sortBy === 'status') {
      return a.status?.localeCompare(b.status || '') || 0;
    } else {
      return 0;
    }
  });

  const getEmptyStateMessage = () => {
    if (searchTerm || filterRecordType || filterStatus) {
      return 'No matching participants found';
    }
    if (noDataReason) {
      return noDataReason;
    }
    return 'No participants available';
  };

  const participantsToDisplay = sortedParticipants;

  return (
    <div
      className='container'
      style={{
        backgroundColor: '#f2f2f2',
        padding: '30px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '15px',
        position: 'relative',
      }}
    >
      <MenuDrawer />
      <h1
        style={{
          fontSize: '28px',
          marginBottom: '20px',
          fontWeight: 'bold',
        }}
      >
        Participant Database
      </h1>

      {/* Container for Search, Filter, Sort, and Create New */}
      <div
        className='controls-container'
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        {/* Search Box */}
        <div className='search-box' style={{ flexGrow: 1, maxWidth: '400px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: '25px',
              padding: '10px 20px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
          >
            <span style={{ marginRight: '10px' }}>🔍</span>
            <input
              type='text'
              placeholder='Search participants...'
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '15px',
              }}
            />
          </div>
        </div>

        {/* Container for Filter, Sort, Create */}
        <div style={{ display: 'flex', gap: '15px' }}>
          {/* Combined Filter Dropdown */}
          <select
            style={{
              padding: '10px 20px',
              borderRadius: '25px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              fontSize: '15px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }}
            value={filterRecordType || filterStatus}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'participant' || value === 'care partner') {
                setFilterRecordType(value);
                setFilterStatus('');
              } else if (value === 'active' || value === 'inactive') {
                setFilterStatus(value);
                setFilterRecordType('');
              } else {
                setFilterRecordType('');
                setFilterStatus('');
              }
            }}
          >
            <option value=''>Filter By: None</option>
            <option value='participant'>Record Type: Participant</option>
            <option value='care partner'>Record Type: Care Partner</option>
            <option value='active'>Status: Active</option>
            <option value='inactive'>Status: Inactive</option>
          </select>

          {/* Sort By Dropdown */}
          <select
            style={{
              padding: '10px 20px',
              borderRadius: '25px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              fontSize: '15px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value='last_name'>Sort By: Last Name</option>
            <option value='first_name'>Sort By: First Name</option>
            <option value='participant_updated_at'>
              Sort By: Date Updated (Most Recent)
            </option>
            <option value='status'>Sort By: Status</option>
          </select>

          {/* Create New Button */}
          <button
            style={{
              padding: '10px 20px',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: '#005696', // Example blue color
              color: 'white',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
          >
            + Create New
          </button>
        </div>
      </div>

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
                Record Type
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
                  Loading peeps...
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
            ) : participantsToDisplay.length > 0 ? (
              participantsToDisplay.map((participant, index) => (
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
                    <div
                      style={{
                        display: 'inline-block',
                        backgroundColor:
                          participant.record_type?.toLowerCase() ===
                          'participant'
                            ? '#FFE0AB'
                            : '#DDC7F1',
                        color:
                          participant.record_type?.toLowerCase() ===
                          'participant'
                            ? '#B16B0E'
                            : '#643A89',
                        padding: '5px 15px',
                        borderRadius: '25px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        minWidth: '80px',
                      }}
                    >
                      {participant.record_type}
                    </div>
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
    </div>
  );
}
