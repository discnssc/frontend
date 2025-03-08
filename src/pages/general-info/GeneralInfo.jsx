import React, { useContext } from 'react';

// import { useEffect, useState } from 'react';

/* import { createClient } from '@supabase/supabase-js';
import { useParams } from 'react-router-dom'; */
import styled from 'styled-components';

import Header from 'common/components/Header';
import { UserContext } from 'common/contexts/UserContext';

/* const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
); */

const InfoPage = styled.div`
  flex: 1 0 0;
  flex-direction: column;
  justify-content: left;
  align-items: left;
  text-align: left;
  padding: 2rem;
`;
const Table = styled.div`
  font-size: 14px;
`;

const TableHead = styled.div`
  flex: 1 0 0;
  flex-direction: column;
  justify-content: left;
  align-items: left;
  text-align: left;
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const TableRow = styled.tr`
  font-size: 14px;
  border: 5px;
`;

const TableLabel = styled.td`
  padding: 8px;
  text-align: left;
  vertical-align: center;
  background-color: #ffffff;
  font-weight: bold;
`;

const TableCell = styled.td`
  padding: 8px;
  text-align: left;
  vertical-align: center;
  background-color: #ffffff;
`;

export default function GeneralInfo() {
  /* const { id } = useParams(); // Get participant ID from URL
  const [participant, setParticipant] = useState(null);

  useEffect(() => {
    const fetchParticipant = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id);

      if (error) {
        console.error('Error fetching participants:', error);
      } else {
        setParticipant(data);
      }
    };
    fetchParticipant();
  }, []); */
  const { user } = useContext(UserContext);

  return (
    <InfoPage>
      <Header />
      <TableHead> Constituent Info </TableHead>
      <Table border='1'>
        <tbody>
          <TableRow>
            <TableLabel> Last Name: </TableLabel>
            <TableCell> {user?.last_name} </TableCell>
          </TableRow>
          <TableRow>
            <th> First Name: </th>
            <td> {user?.first_name} </td>
          </TableRow>
          <TableRow>
            <th> First Name: </th>
            <td> {user?.first_name} </td>
          </TableRow>
        </tbody>
      </Table>
    </InfoPage>
  );
}
