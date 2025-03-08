import React, { useContext } from 'react';

import styled from 'styled-components';

import { UserContext } from 'common/contexts/UserContext';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 20px;
`;

const Names = styled.div`
  font-size: 25px;
  display: flex;
  justify-content: left;
  align-items: center;
  font-weight: bold;
`;

const Dates = styled.div`
  font-weight: normal;
  display: flex;
  flex-direction: column;
  text-align: right;
  height: 100%;
  font-size: 12px;
`;

export default function Header() {
  const { user } = useContext(UserContext);

  return (
    <HeaderContainer>
      <Names>
        {user?.firstname || 'User'} {user?.lastname || 'User'}
      </Names>
      <Dates>
        <p>Date Created: {user?.created_at}</p>
        <p>Date Updated: {user?.updated_at}</p>
      </Dates>
    </HeaderContainer>
  );
}
