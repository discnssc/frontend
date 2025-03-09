import React, { useEffect, useState } from 'react';

import { createClient } from '@supabase/supabase-js';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 20px;
`;

const Left = styled.div`
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: center;
  font-weight: bold;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  height: 100%;
`;

const SmallText = styled.h1`
  font-size: 12px;
  font-weight: normal;
`;

export default function Header() {
  const { id } = useParams(); // Get participant ID from URL
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
  }, []);

  return (
    <HeaderContainer>
      <Left>
        {participant.first_name || 'User'} {participant.last_name || 'User'}
        <span
          style={{
            backgroundColor:
              participant.status === 'Inactive' ? '#f8d7da' : '#d4edda',
            color: participant.status === 'Inactive' ? '#721c24' : '#155724',
            padding: '5px 15px',
            borderRadius: '25px',
            fontSize: '14px',
          }}
        >
          {participant.status}
        </span>
        <SmallText>Participant ID: {participant.id || 'N/A'}</SmallText>
      </Left>
      <Right>
        <SmallText>Date Created: {participant.created_at || 'N/A'}</SmallText>
        <SmallText>Date Updated: {participant.updated_at || 'N/A'}</SmallText>
      </Right>
    </HeaderContainer>
  );
}
