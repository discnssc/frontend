import React, { useEffect, useState } from 'react';

import { createClient } from '@supabase/supabase-js';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import Header from 'common/components/Header';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

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
  margin-right: 2rem;
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

export default function GeneralInfo() {
  const { id } = useParams();
  const [generalInfo, setGeneralInfo] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [participantInfo, setParticipantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          { data: generalData, error: generalError },
          { data: contactData, error: contactError },
          { data: participantData, error: participantError },
        ] = await Promise.all([
          supabase
            .from('participant_general_info')
            .select('*')
            .eq('id', id)
            .single(),
          supabase
            .from('participant_address_and_contact')
            .select('*')
            .eq('id', id)
            .single(),
          supabase
            .from('participants')
            .select('id, participant_created_at, participant_updated_at')
            .eq('id', id)
            .single(),
        ]);

        if (generalError) throw new Error(generalError.message);
        if (contactError) throw new Error(contactError.message);
        if (participantError) throw new Error(participantError.message);

        console.log('Fetched General Info:', generalData);
        console.log('Fetched Contact Info:', contactData);
        console.log('Fetched Participant Info:', participantData);

        setGeneralInfo(generalData);
        setContactInfo(contactData);
        setParticipantInfo(participantData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <Loading>Error: {error}</Loading>;

  const handleChange = async (e, field, table, setState) => {
    const updatedValue = e.target.value;

    setState((prev) => ({
      ...prev,
      [field]: updatedValue,
    }));

    try {
      const { error } = await supabase
        .from(table)
        .update({ [field]: updatedValue })
        .eq('id', id);

      if (error) throw new Error(error.message);
    } catch (err) {
      console.error(`Error updating ${table}:`, err);
    }
  };

  return (
    <InfoPage>
      <Header participant={{ ...generalInfo, ...participantInfo }} />
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
