import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from 'common/components/Button';

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 25%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
`;

export const StyledInput = styled.input`
  font-size: 1rem;
  padding: 8px;
  border-radius: 8px;
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
  width: 450px;
  font-size: 1rem;
  padding-left: 30px;
  padding-right: 30px;
  margin-left: auto;
  margin-right: auto;
  color: white;
`;

export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
`;

export const StyledLink = styled(Link)`
  color: var(--primary-blue);
  text-decoration: none;
  font-size: 1rem;
  margin-top: -30px;
  width: 500px;
  padding: 0px;
  font-style: italic;

  &:hover {
    text-decoration: underline;
  }
`;
