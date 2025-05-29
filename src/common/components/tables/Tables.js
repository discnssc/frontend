import styled from 'styled-components';

export const TableContainer = styled.div`
  width: 800px;
  margin: 48px 0 0 0;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  border: 1px solid #e0e0e0;
  width: auto;
  background-color: white;
`;

export const TableCell = styled.div`
  display: table-cell;
  padding: 25px 30px;
  font-size: 16px;
  text-align: left;
  vertical-align: middle;
  border: 1px solid #e0e0e0;
  width: auto;
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

  select {
    background: transparent;
    border: none;
    outline: none;
    font-size: 16px;
    width: 100%;
    padding: 0;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1em;
    padding-right: 2.5rem;
  }

  select:focus {
    outline: none;
  }
`;
