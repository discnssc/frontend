import React, { useState, useEffect } from 'react';

export default function ParticipantDatabase() {
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      setIsLoading(true);
      try {
        // Replace this URL with your actual Supabase endpoint
        const response = await fetch('', {
          headers: {
            // Add your Supabase API key and other required headers
            'apikey': '',
            'Authorization': '',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setParticipants(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching participants:', err);
        setError('Failed to load participants. Please try again later.');
        setParticipants([]);
      } finally {
        setIsLoading(false);
      }
    };

    // For testing purposes, let's add some mock data
    const mockData = [
      { id: 1, firstName: 'John', lastName: 'Doe', caregiver: 'Jane Smith', dateUpdated: '2025-02-15', status: 'Active' },
      { id: 2, firstName: 'Sarah', lastName: 'Johnson', caregiver: 'Mike Brown', dateUpdated: '2025-02-10', status: 'Active' },
      { id: 3, firstName: 'Robert', lastName: 'Williams', caregiver: 'Lisa Jones', dateUpdated: '2025-01-28', status: 'Inactive' },
      { id: 4, firstName: 'Emily', lastName: 'Davis', caregiver: 'Tom Wilson', dateUpdated: '2025-03-01', status: 'Active' },
      { id: 5, firstName: 'Michael', lastName: 'Garcia', caregiver: 'Susan Miller', dateUpdated: '2025-02-20', status: 'Inactive' }
    ];

    // Comment out fetchParticipants() and use mockData instead for testing
    // fetchParticipants();
    setParticipants(mockData);
    setIsLoading(false);

  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredParticipants = participants.filter(participant => {
    const searchLower = searchTerm.toLowerCase();
    return (
      participant.firstName?.toLowerCase().includes(searchLower) ||
      participant.lastName?.toLowerCase().includes(searchLower) ||
      participant.caregiver?.toLowerCase().includes(searchLower) ||
      participant.status?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container" style={{
      backgroundColor: '#f2f2f2',
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
      fontSize: '15px',
    }}>
      <h1 style={{
        fontSize: '28px',
        marginBottom: '20px',
        fontWeight: 'bold',
      }}>Participant Database</h1>
      <div className="search-filter-container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        <div className="search-box" style={{
          width: '40%',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: '25px',
            padding: '10px 20px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16" style={{ color: '#888', marginRight: '10px' }}>
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Search participants..."
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
        <div className="filters" style={{
          display: 'flex',
          gap: '20px',
        }}>
          <div className="filter-dropdown" style={{
            backgroundColor: 'white',
            borderRadius: '25px',
            padding: '10px 20px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '200px',
            fontSize: '15px',
          }}>
            <span style={{ color: '#888' }}>Filter By: None</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
          </div>      
          <div className="sort-dropdown" style={{
            backgroundColor: 'white',
            borderRadius: '25px',
            padding: '10px 20px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '200px',
            fontSize: '15px',
          }}>
            <span style={{ color: '#888' }}>Sort By: Last Name</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
          </div>
        </div>
      </div>     
      <div className="table-container">
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          borderRadius: '10px',
          overflow: 'hidden',
          fontSize: '15px',
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#005696',
            }}>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'normal', color: 'white' }}>First Name</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'normal', color: 'white' }}>Last Name</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'normal', color: 'white' }}>Caregiver</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'normal', color: 'white' }}>Date Updated</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'normal', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}> 
                Status
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr style={{ backgroundColor: 'white' }}>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>
                  Loading participants...
                </td>
              </tr>
            ) : error ? (
              <tr style={{ backgroundColor: 'white' }}>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>
                  {error}
                </td>
              </tr>
            ) : filteredParticipants.length > 0 ? (
              filteredParticipants.map((participant, index) => (
                <tr key={participant.id || index} style={{
                  backgroundColor: 'white',
                  borderBottom: '1px solid #eee',
                }}>
                  <td style={{ padding: '15px' }}>{participant.firstName}</td>
                  <td style={{ padding: '15px' }}>{participant.lastName}</td>
                  <td style={{ padding: '15px' }}>{participant.caregiver}</td>
                  <td style={{ padding: '15px' }}>{participant.dateUpdated}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      backgroundColor: participant.status === 'Inactive' ? '#f8d7da' : '#d4edda',
                      color: participant.status === 'Inactive' ? '#721c24' : '#155724',
                      padding: '5px 15px',
                      borderRadius: '25px',
                      fontSize: '14px',
                    }}>
                      {participant.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr style={{ backgroundColor: 'white' }}>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                  {searchTerm ? 'No matching participants found' : 'No participants available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}