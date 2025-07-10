import React from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  margin-top: 40px;
`;

const Left = styled.div`
  font-size: 25px;
  display: flex;
  flex-direction: column;
  justify-content: left;
  font-weight: bold;
  text-align: left;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  height: 100%;
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;
const TypeBadge = styled.div`
  display: inline-block;
  padding: 5px 15px;
  margin-left: 10px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  min-width: 80px;
  background-color: ${({ type }) =>
    type?.toLowerCase() === 'participant' ? '#FFE0AB' : '#DDC7F1'};
  color: ${({ type }) =>
    type?.toLowerCase() === 'participant' ? '#B16B0E' : '#643A89'};
`;

const SmallTextBold = styled.h1`
  font-size: 15px;
  font-weight: bold;
`;

const SmallText = styled.h1`
  font-size: 15px;
  font-weight: normal;
  margin: 5px 0;
`;

export default function Header({ participant }) {
  console.log('Participant Header:', participant);
  return (
    <HeaderContainer>
      <Left>
        <FlexRow>
          {participant?.participant_general_info?.first_name || 'User'}{' '}
          {participant?.participant_general_info?.last_name || 'User'}{' '}
          <TypeBadge type={participant.participant_general_info.type}>
            {participant.participant_general_info.type}
          </TypeBadge>
        </FlexRow>
        <div
          style={{
            display: 'inline-block',
            backgroundColor:
              participant.status?.toLowerCase() === "'inactive'"
                ? '#f8d7da'
                : '#d4edda',
            color:
              participant.status?.toLowerCase() === "'inactive'"
                ? '#721c24'
                : '#155724',
            padding: '5px 15px',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'center',
            width: '75px',
          }}
        >
          {participant.status}
        </div>
        <SmallTextBold>
          Participant ID:<SmallText>{participant?.id || 'N/A'}</SmallText>
        </SmallTextBold>
        <SmallTextBold>
          HOW ID:<SmallText>123456</SmallText>
        </SmallTextBold>
      </Left>
      <Right>
        <SmallTextBold>
          Date Created:
          <SmallText>
            {participant?.participant_created_at
              ? participant.participant_created_at.split('T')[0]
              : 'N/A'}
          </SmallText>
        </SmallTextBold>
        <SmallTextBold>
          Date Updated:
          <SmallText>
            {participant?.participant_updated_at
              ? participant.participant_updated_at.split('T')[0]
              : 'N/A'}
          </SmallText>
        </SmallTextBold>
      </Right>
    </HeaderContainer>
  );
}

Header.propTypes = {
  participant: PropTypes.shape({
    id: PropTypes.string,
    participant_general_info: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      type: PropTypes.string, // e.g., 'Participant', 'Care partner'
    }),
    status: PropTypes.string,
    participant_created_at: PropTypes.string,
    participant_updated_at: PropTypes.string,
  }),
};

Header.defaultProps = {
  participant: {},
};
