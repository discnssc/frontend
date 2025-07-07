import styled from 'styled-components';

import { Button } from 'common/components/Button';

export const InputContainer = styled.div`
  flex: 1;
`;

export const InputName = styled.h3`
  margin: 0;
  text-align: left;
  font-weight: normal;
  font-size: 16px;
  margin-bottom: 10px;
`;

export const InputTitle = styled.span`
  margin-right: 0px;
`;

export const RedSpan = styled.span`
  color: red;
`;

export const StyledInput = styled.input`
  all: unset;
  background-color: white;
  text-align: left;
  font-size: 16px;
  padding: 20px 30px;
  border-radius: 10px;
  width: auto;
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
  font-size: 16px;
  border-radius: 10px;
  font-weight: bold;
  width: auto;
  color: white;
  background-color: var(--primary-blue);
  padding: 20px 30px;
  margin-top: 29px;
`;
