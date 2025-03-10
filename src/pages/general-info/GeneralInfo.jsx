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
  const { id } = useParams(); // Get participant ID from URL
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipant = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw new Error(error.message);
        }
        setParticipant(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchParticipant();
  }, [id]);

  if (loading) {
    return <Loading>Loading...</Loading>;
  }

  if (error) {
    return <Loading>Error: {error}</Loading>;
  }

  const handleChange = async (e, field) => {
    const updatedValue = e.target.value;
    setParticipant((prevParticipant) => ({
      ...prevParticipant,
      [field]: updatedValue,
    }));

    try {
      const { error } = await supabase
        .from('users')
        .update({ [field]: updatedValue })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      console.error('Error updating field:', err);
    }
  };

  return (
    <InfoPage>
      <Header />
      <TableContainer>
        <TableHead>Participant Info</TableHead>
        <Table>
          <tbody>
            {Object.keys(participant).map((key) => (
              <TableRow key={key}>
                <TableLabel>{key.replace(/_/g, ' ')}:</TableLabel>
                <TableCell>
                  <input
                    type='text'
                    value={participant[key] || ''}
                    onChange={(e) => handleChange(e, key)}
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
/* return (
    <InfoPage>
      <Header />
      <TableContainer>
        <TableHead> Participant Info </TableHead>
        <Table>
          <tbody>
            <TableRow>
              <TableLabel> Last Name: </TableLabel>
              <TableCell> {participant?.last_name} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> First Name: </TableLabel>
              <TableCell> {participant?.first_name} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> Middle Name: </TableLabel>
              <TableCell> {participant?.middle_name} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> Nickname: </TableLabel>
              <TableCell> {participant?.nickname} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> Gender: </TableLabel>
              <TableCell> {participant?.gender} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> Date of Birth: </TableLabel>
              <TableCell> {participant?.date_of_birth} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> Maiden Name: </TableLabel>
              <TableCell> {participant?.maiden_name} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> Suffix: </TableLabel>
              <TableCell> {participant?.suffix} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> Contract Code: </TableLabel>
              <TableCell> {participant?.contract_code} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> Caregiver/Recipient: </TableLabel>
              <TableCell> {participant?.care_giver} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> Preferred Worker: </TableLabel>
              <TableCell> {participant?.preferred_worker} </TableCell>
            </TableRow>
          </tbody>
        </Table>
      </TableContainer>
      <TableContainer>
        <TableHead> Address and Contact </TableHead>
        <Table border='1'>
          <tbody>
            <TableRow>
              <TableLabel> Address Line 1: </TableLabel>
              <TableCell> {participant?.address_line_1} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> Address Line 2: </TableLabel>
              <TableCell> {participant?.address_line_2} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> City: </TableLabel>
              <TableCell> {participant?.city} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> Township: </TableLabel>
              <TableCell> {participant?.township} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> State: </TableLabel>
              <TableCell> {participant?.state} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> Zip Code: </TableLabel>
              <TableCell> {participant?.zip_code} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> Email: </TableLabel>
              <TableCell> {participant?.email} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> Primary Phone Number: </TableLabel>
              <TableCell> {participant?.primary_phone_number} </TableCell>
            </TableRow>
            <TableRow>
              <TableLabel> Secondary Phone Number: </TableLabel>
              <TableCell> {participant?.secondary_phone_number} </TableCell>
            </TableRow>
          </tbody>
        </Table>
      </TableContainer>
    </InfoPage>
  );
}
 */
