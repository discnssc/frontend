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
  margin-left: 50px;
`;

const TableContainer = styled.div`
  font-size: 15px;
  width: 450px;
  display: table;
  vertical-align: top;
  float: left;
  margin-right: 2rem;
  align-items: flex-start;
  margin-top: 40px;
  margin-left: 135px;
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

export default function GeneralInfo() {
  const { id } = useParams();
  const [generalInfo, setGeneralInfo] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [participantInfo, setParticipantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch data through backend API instead of direct Supabase calls
        const response = await fetch(`${API_BASE_URL}/participants/${id}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched Participant Data:', data);

        // Extract the data from the response
        setGeneralInfo(data.participant_general_info || null);
        setContactInfo(data.participant_address_and_contact || null);
        setParticipantInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, API_BASE_URL]);

  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <Loading>Error: {error}</Loading>;

  const handleChange = async (e, field, table, setState) => {
    const updatedValue = e.target.value;

    setState((prev) => ({
      ...prev,
      [field]: updatedValue,
    }));

    try {
      // Update through the backend API
      const response = await fetch(`${API_BASE_URL}/participants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          [table]: {
            [field]: updatedValue,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
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
        <TableHead>Participant Info</TableHead>
        <Table>
          <tbody>
            {generalInfo &&
              Object.keys(generalInfo)
                .filter((key) => key !== 'id' && key !== 'status')
                .map((key) => (
                  <TableRow key={key}>
                    <TableLabel>
                      {key
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                      :
                    </TableLabel>
                    <TableCell>
                      <input
                        type='text'
                        value={generalInfo[key] || ''}
                        onChange={(e) =>
                          handleChange(
                            e,
                            key,
                            'participant_general_info',
                            setGeneralInfo
                          )
                        }
                        style={{
                          background: 'transparent', // Match table background
                          border: 'none', // Remove border
                          outline: 'none', // Remove focus outline
                          fontSize: '15px', // Match table text
                          padding: '5px', // Add some spacing
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
          </tbody>
        </Table>
      </TableContainer>

      <TableContainer>
        <TableHead>Address and Contact Info</TableHead>
        <Table>
          <tbody>
            {contactInfo &&
              Object.keys(contactInfo)
                .filter((key) => key !== 'id')
                .map((key) => (
                  <TableRow key={key}>
                    <TableLabel>
                      {key
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                      :
                    </TableLabel>
                    <TableCell>
                      <input
                        type='text'
                        value={contactInfo[key] || ''}
                        onChange={(e) =>
                          handleChange(
                            e,
                            key,
                            'participant_address_and_contact',
                            setContactInfo
                          )
                        }
                        style={{
                          background: 'transparent', // Match table background
                          border: 'none', // Remove border
                          outline: 'none', // Remove focus outline
                          fontSize: '15px', // Match table text
                          padding: '5px', // Add some spacing
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
          </tbody>
        </Table>
      </TableContainer>
    </InfoPage>
  );
}
