import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--light-grey);
  gap: 40px;
  padding: 50px 40px;
  text-align: center;
  height: 100vh;
  width: 40vw;
  position: relative;
`;

export const FormTitle = styled.h2`
  font-size: 1.8rem;
  font-family: 'Title', sans-serif;
`;
