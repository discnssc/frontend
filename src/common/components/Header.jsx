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

const StatusButton = styled.span`
  display: inline-block;
  padding: 5px 15px;
  margin-left: 10px;
  background-color: ${(props) =>
    props.status === 'Inactive' ? '#f8d7da' : '#d4edda'};
  color: ${(props) => (props.status === 'Inactive' ? '#721c24' : '#155724')};
  border-radius: 20px;
  font-size: 14px;
  width: 100px;
  text-align: center;
`;

export default function Header({ participant }) {
  return (
    <HeaderContainer>
      <Left>
        {participant?.first_name || 'User'} {participant?.last_name || 'User'}{' '}
        <StatusButton status={participant?.status}>
          {' '}
          {participant?.status || 'Unknown'}
        </StatusButton>
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