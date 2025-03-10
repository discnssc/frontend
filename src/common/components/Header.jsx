import React from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 20px;
`;

const Left = styled.div`
  font-size: 25px;
  display: flex;
  flex-direction: column;
  justify-content: left;
  font-weight: bold;
  text-align: left;
  padding: 10px;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  height: 100%;
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
  return (
    <HeaderContainer>
      <Left>
        {participant?.first_name || 'User'} {participant?.last_name || 'User'}{' '}
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
            marginTop: '10px',
            width: '75px',
          }}
        >
          {participant.status}
        </div>
        <SmallTextBold>
          Participant ID:<SmallText>{participant?.id || 'N/A'}</SmallText>
        </SmallTextBold>
      </Left>
      <Right>
        <SmallTextBold>
          Date Created:
          <SmallText>{participant?.participant_created_at || 'N/A'}</SmallText>
        </SmallTextBold>
        <SmallTextBold>
          Date Updated:
          <SmallText>{participant?.participant_updated_at || 'N/A'}</SmallText>
        </SmallTextBold>
      </Right>
    </HeaderContainer>
  );
}

Header.propTypes = {
  participant: PropTypes.shape({
    id: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    status: PropTypes.string,
    participant_created_at: PropTypes.string,
    participant_updated_at: PropTypes.string,
  }),
};

Header.defaultProps = {
  participant: {},
};
