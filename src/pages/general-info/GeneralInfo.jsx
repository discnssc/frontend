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

const Table = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: left;
  font-size: 13px;
`;

const InfoPage = styled.div`
  flex: 1 0 0;
  flex-direction: column;
  justify-content: left;
  align-items: left;
  text-align: left;
  padding: 2rem;
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
      <section>
        Constituent Info:
        <Table>
          <p>Last Name: {user?.last_name}</p>
          <p>First Name: {user?.first_name}</p>
          <p>Middle Name: {user?.middle_name}</p>
          <p>Nickname: {user?.nickname}</p>
          <p>SSN: *********</p>
          <p>Gender: {user?.gender}</p>
          <p>Date of Birth: {user?.date_of_birth}</p>
          <p>Suffix: {user?.suffix}</p>
          <p>Maiden Name: {user?.maiden_name}</p>
          <p>Suffix: {user?.suffix}</p>
          <p>Contract Code: {user?.contract_code}</p>
          <p>Caregiver/Recipient: {user?.care_giver}</p>
          <p>Preferred Worker: {user?.preferred_worker}</p>
          <p>Status: {user?.status}</p>
        </Table>
      </section>
    </InfoPage>
  );
}
