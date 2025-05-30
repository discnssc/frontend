import React from 'react';

import styled from 'styled-components';

import ParticipantNavbar from 'common/components/ParticipantNavBar';

const InfoPage = styled.div`
  flex-direction: row;
  justify-content: left;
  align-items: left;
  text-align: left;
  padding: 2rem;
`;

const MessageText = styled.div`
  font-size: 18px;
  margin-top: 20px;
  text-align: center;
`;

export default function HowInfo() {
  return (
    <InfoPage>
      <ParticipantNavbar />
      <MessageText>Page is not done yet!</MessageText>
    </InfoPage>
  );
}
