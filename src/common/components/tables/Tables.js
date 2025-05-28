import styled from 'styled-components';

export const TableContainer = styled.div`
  width: 100%;
  margin: 0px;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
  overflow: hidden;
`;

export const Table = styled.div`
  width: 100%;
  display: table;
  border-collapse: collapse;
  border-spacing: 0;
`;

export const TableHead = styled.div`
  width: 100%;
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  margin-bottom: 18px;
`;

export const TableRow = styled.div`
  display: table-row;
  width: 100%;
`;

export const TableLabel = styled.div`
  color: #000;
  font-family: Roboto, Arial, sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 18px;
`;

export const TableRowLabel = styled.div`
  display: table-cell;
  padding: 20px 24px;
  font-weight: bold;
  font-size: 16px;
  text-align: left;
  vertical-align: middle;
  border: 1px solid var(--lighter-grey);
  width: auto;
  background-color: white;
`;

export const TableHeaderCell = styled.div`
  display: table-cell;
  padding: 20px 30px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  text-align: left;
  vertical-align: middle;
  border: 1px solid var(--lighter-grey);
  width: %auto;
  background-color: var(--primary-blue);
`;

export const TableCell = styled.div`
  display: table-cell;
  padding: 20px 30px;
  font-size: 16px;
  text-align: left;
  vertical-align: middle;
  border: 1px solid var(--lighter-grey);
  width: %auto;
  background-color: white;

  input[type='checkbox'] {
    margin: 0;
    vertical-align: middle;
    width: 20px;
    height: 20px;
    accent-color: #1976d2;
  }

  input[type='text'] {
    background: transparent;
    border: none;
    outline: none;
    font-size: 16px;
    width: 100%;
    padding: 0;
  }
`;
