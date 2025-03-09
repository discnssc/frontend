import React, { useEffect, useState } from 'react';

export default function ParticipantDatabase() {
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      setIsLoading(true);
      console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
      console.log('Token available:', !!localStorage.getItem('access_token'));
      console.log(
        'Token from localStorage:',
        localStorage.getItem('access_token')
      );
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found. Please log in.');
      }

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(
          `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/participants`,
          {
            headers: {
              apikey: process.env.REACT_APP_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Prefer: 'return=representation',
            },
          }
        );
        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setParticipants(data);
        setError(null);
      } catch (err) {
        // Enhanced error logging
        console.error('Error details:', err.message);
        console.error('Error fetching participants:', err);
        setError('Failed to load participants. Please try again later.');
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
    return (
      participant.firstName?.toLowerCase().includes(searchLower) ||
      participant.lastName?.toLowerCase().includes(searchLower) ||
      participant.caregiver?.toLowerCase().includes(searchLower) ||
      participant.status?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div
      className='container'
      style={{
        backgroundColor: '#f2f2f2',
        padding: '30px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '15px',
      }}
    >
      <h1
        style={{
          fontSize: '28px',
          marginBottom: '20px',
          fontWeight: 'bold',
        }}
      >
        Participant Database
      </h1>

      {/* search facility */}
      <div
        className='search-filter-container'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <div className='search-box' style={{ width: '40%' }}>
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
            {/* apparently you can copy and paste emojis */}
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
      </div>

      {/* Table for the participants! */}
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
                Date Updated
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
                  Loading participants...
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
            ) : filteredParticipants.length > 0 ? (
              filteredParticipants.map((participant, index) => (
                <tr
                  key={participant.id || index}
                  style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <td style={{ padding: '15px' }}>{participant.firstName}</td>
                  <td style={{ padding: '15px' }}>{participant.lastName}</td>
                  <td style={{ padding: '15px' }}>{participant.caregiver}</td>
                  <td style={{ padding: '15px' }}>{participant.dateUpdated}</td>
                  {/* Active */}
                  <td style={{ padding: '15px' }}>
                    <div
                      style={{
                        display: 'inline-block',
                        backgroundColor:
                          participant.status === 'Inactive'
                            ? '#f8d7da'
                            : '#d4edda',
                        color:
                          participant.status === 'Inactive'
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
                  {searchTerm
                    ? 'No matching participants found'
                    : 'No participants available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
