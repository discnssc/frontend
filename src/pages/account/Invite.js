import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const StyledCenterAlignPage = styled.div`
  flex: 1 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--lighter-grey);
  overflow: hidden;
`;

export const BackArrowContainer = styled(Link)`
  position: absolute;
  top: 0;
  left: 0;
  margin: 70px 20px;
`;
