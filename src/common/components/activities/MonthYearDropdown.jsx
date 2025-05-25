/* eslint-disable react/prop-types */
import React from 'react';

import styled from 'styled-components';

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0px 0px 15px 0px;
`;

const DropdownInputBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const DropdownSelect = styled.select`
  padding: 10px 50px 10px 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #fff;
  background-color: #fff;
  cursor: pointer;
  margin: 10px 10px 10px 0px;
  &:focus {
    outline: none;
    border-color: #005696;
    box-shadow: 0 0 5px rgba(0, 86, 150, 0.3);
  }
`;
const DropdownInput = ({ value, onChange, options, label }) => {
  return (
    <DropdownInputBlock>
      <label>{label}</label>
      <DropdownSelect value={value} onChange={onChange}>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </DropdownSelect>
    </DropdownInputBlock>
  );
};
export default function MonthYearDropdown({
  monthLabel,
  yearLabel,
  month,
  year,
  onMonthChange,
  onYearChange,
}) {
  const monthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  const yearOptions = [
    { value: '2020', label: '2020' },
    { value: '2021', label: '2021' },
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
  ];
  return (
    <DropdownContainer>
      <DropdownInput
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
        options={monthOptions}
        label={monthLabel}
      />
      <DropdownInput
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
        options={yearOptions}
        label={yearLabel}
      />
    </DropdownContainer>
  );
}
