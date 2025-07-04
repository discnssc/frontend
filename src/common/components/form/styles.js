import styled from 'styled-components';

import { Button } from 'common/components/Button';

export const InputContainer = styled.div``;

export const InputName = styled.h3`
  margin: 0;
  text-align: left;
  font-weight: normal;
  font-size: 1rem;
  margin-bottom: 4px;
`;
export const InputTitle = styled.span`
  margin-right: 2px;
`;
export const RedSpan = styled.span`
  color: red;
`;

export const StyledInput = styled.input`
  all: unset;
  background-color: white;
  text-align: left;
  font-size: 1rem;
  padding: 10px 15px;
  border-radius: 10px;
  width: 500px;
`;

export const PasswordContainer = styled.div`
  position: relative;
  width: fit-content;
`;

export const IconContainer = styled.div`
  position: absolute;
  right: 10px;
  top: 8px;
  background-color: var(--white);
  cursor: pointer;
`;

export const StyledButton = styled(Button.Primary)`
  all: unset;
  text-align: center;
  font-size: 1rem;
  border-radius: 10px;
  font-weight: bold;
  width: 500px;
  color: white;
  background-color: var(--primary-blue);
  padding: 10px 15px;
`;
