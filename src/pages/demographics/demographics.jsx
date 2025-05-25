import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import Header from 'common/components/Header';
import HomeButton from 'common/components/HomeButton';
import ParticipantNavbar from 'common/components/ParticipantNavBar';

const InfoPage = styled.div`
  flex-direction: row;
  justify-content: left;
  align-items: left;
  text-align: left;
  padding: 2rem;
`;

const TableContainer = styled.div`
  font-size: 15px;
  width: 45%;
  display: table;
  vertical-align: top;
  float: left;
  margin-left: 160px;
  margin-top: 40px;
  align-items: flex-start;
`;

const Table = styled.div`
  font-size: 15px;
  width: 45%;
  display: table;
  vertical-align: top;
  float: left;
  margin-right: 2rem;
  align-items: flex-start;
`;

const TableHead = styled.div`
  flex: 1 0 0;
  flex-direction: column;
  justify-content: left;
  align-items: left;
  text-align: left;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 1rem;
  align-items: flex-start;
`;

const TableRow = styled.tr`
  font-size: 15px;
`;

const TableLabel = styled.th`
  padding: 8px;
  text-align: left;
  vertical-align: center;
  background-color: #ffffff;
  font-weight: bold;
  border: 0.5px solid #aaaaaa;
`;

const TableCell = styled.td`
  padding: 8px;
  text-align: left;
  vertical-align: center;
  background-color: #ffffff;
  border: 0.5px solid #aaaaaa;
  justify-content: center;
  flex-shrink: 0;
`;

const Loading = styled.div`
  font-size: 18px;
  color: #999;
`;

// Helper function to build API URLs
const buildUrl = (endpoint) =>
  `${process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '')}${endpoint}`;

export default function Demographics() {
  const { id } = useParams();
  const [demographicInfo, setDemographicInfo] = useState(null);
  const [participantInfo, setParticipantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get auth token from localStorage
        const token = localStorage.getItem('authToken');

        // Fetch participant data from backend
        const response = await fetch(buildUrl(`/participants/${id}`), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch participant data');
        }

        const data = await response.json();

        // Extract data from the response
        const demographicData = data.participant_demographics;
        const participantData = data;

        console.log('Fetched Demographic Info:', demographicData);
        console.log('Fetched Participant Info:', participantData);

        setDemographicInfo(demographicData);
        setParticipantInfo(participantData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <Loading>Error: {error}</Loading>;

  // List of known boolean fields
  const booleanFields = [
    'hispanic_or_latino',
    'living_alone',
    'live_in_nursing_home',
    'case_worker_risk',
    'has_pet',
    'homeless',
    'female_headed_household',
    'frail_disabled',
    'limited_english',
  ];

  const handleChange = async (e, field, table, setState) => {
    const isCheckbox = booleanFields.includes(field);
    const updatedValue = isCheckbox ? e.target.checked : e.target.value;

    // Update the local state
    setState((prev) => ({
      ...prev,
      [field]: updatedValue,
    }));

    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');

      // Create payload with only the updated table data
      const payload = {
        [table]: {
          [field]: updatedValue,
        },
      };

      // Send update to backend
      const response = await fetch(buildUrl(`/participants/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Update failed');
      }
    } catch (err) {
      console.error(`Error updating ${table}:`, err);
    }
  };

  return (
    <InfoPage>
      <Header participant={participantInfo} />
      <HomeButton />
      <ParticipantNavbar />
      <TableContainer>
        <TableHead>Demographics</TableHead>
        <Table>
          <tbody>
            {demographicInfo &&
              Object.keys(demographicInfo)
                .filter((key) => key !== 'id' && key !== 'status')
                .map((key) => {
                  const isBoolean = booleanFields.includes(key);
                  const value = demographicInfo[key] || false;

                  return (
                    <TableRow key={key}>
                      <TableLabel>
                        {key
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                        :
                      </TableLabel>
                      <TableCell>
                        {isBoolean ? (
                          <input
                            type='checkbox'
                            checked={!!value}
                            onChange={(e) =>
                              handleChange(
                                e,
                                key,
                                'participant_demographics',
                                setDemographicInfo
                              )
                            }
                            style={{
                              margin: '0',
                              width: '15px',
                              height: '15px',
                              cursor: 'pointer',
                            }}
                          />
                        ) : (
                          <input
                            type='text'
                            value={value || ''}
                            onChange={(e) =>
                              handleChange(
                                e,
                                key,
                                'participant_demographics',
                                setDemographicInfo
                              )
                            }
                            style={{
                              background: 'transparent',
                              border: 'none',
                              outline: 'none',
                              fontSize: '15px',
                              padding: '5px',
                            }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </tbody>
        </Table>
      </TableContainer>
    </InfoPage>
  );
}
