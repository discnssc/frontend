import React from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

const SortDropdown = styled.div`
  position: absolute;
  top: 48px;
  right: 0;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  min-width: 180px;
  z-index: 20;
  padding: 8px 0;
  margin-top: 10px;
`;

const SortDropdownItem = styled.div`
  padding: 16px 24px;
  font-size: 1.1rem;
  cursor: pointer;
  background: ${({ active }) => (active ? '#f5f5f5' : 'transparent')};
  &:hover {
    background: #f5f5f5;
  }
`;

export default function SortDropdownComponent({
  isOpen,
  onClose,
  sortBy,
  onSortChange,
}) {
  if (!isOpen) return null;

  return (
    <SortDropdown>
      <SortDropdownItem
        active={sortBy === 'lastName'}
        onClick={() => {
          onSortChange('lastName');
          onClose();
        }}
      >
        Last Name
      </SortDropdownItem>
      <SortDropdownItem
        active={sortBy === 'active'}
        onClick={() => {
          onSortChange('active');
          onClose();
        }}
      >
        Active
      </SortDropdownItem>
    </SortDropdown>
  );
}

SortDropdownComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sortBy: PropTypes.oneOf(['lastName', 'active']).isRequired,
  onSortChange: PropTypes.func.isRequired,
};
