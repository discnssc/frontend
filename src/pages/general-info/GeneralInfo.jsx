import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';


import Header from 'common/components/Header';
import HomeButton from 'common/components/HomeButton';
import ParticipantNavbar from 'common/components/ParticipantNavBar';
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableLabel,
  TableRow,
  TableRowLabel,
} from 'common/components/tables/Tables';


const InfoPage = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  margin-left: 0;
  width: 100%;
  background-color: #ECECEC;
`;

const TablesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 2rem;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
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
        setParticipantInfo({
          id: data.id,
          participant_created_at: data.participant_created_at,
          participant_updated_at: data.participant_updated_at,
        });
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
    <InfoPage className='general-info'>
      <Header participant={{ ...generalInfo, ...participantInfo }} />
      <HomeButton />
      <ParticipantNavbar />
      <TablesContainer>
        <TableContainer>
          <TableLabel>Participant Info</TableLabel>
          <Table>
            <TableHead>
              {generalInfo &&
                Object.keys(generalInfo)
                  .filter((key) => key !== 'id' && key !== 'status')
                  .map((key) => (
                    <TableRow key={key}>
                      <TableRowLabel>
                        {key
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </TableRowLabel>
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
                        />
                      </TableCell>
                    </TableRow>
                  ))}
            </TableHead>
          </Table>
        </TableContainer>

        <TableContainer>
          <TableLabel>Address and Contact Info</TableLabel>
          <Table>
            <TableHead>
              {contactInfo &&
                Object.keys(contactInfo)
                  .filter((key) => key !== 'id')
                  .map((key) => (
                    <TableRow key={key}>
                      <TableRowLabel>
                        {key
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </TableRowLabel>
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
                        />
                      </TableCell>
                    </TableRow>
                  ))}
            </TableHead>
          </Table>
        </TableContainer>
      </TablesContainer>
    </InfoPage>
  );
}
