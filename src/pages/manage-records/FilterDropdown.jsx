import React from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

const DropdownMenu = styled.div`
  position: absolute;
  top: 48px;
  right: 0;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  min-width: 220px;
  z-index: 20;
  padding: 8px 0;
  margin-top: 10px;
`;

const DropdownItem = styled.div`
  padding: 16px 24px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  background: ${({ active }) => (active ? '#f5f5f5' : 'transparent')};
  &:hover {
    background: #f5f5f5;
  }
  justify-content: space-between;
`;

const SubMenu = styled.div`
  position: absolute;
  top: 0;
  left: 100%;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  min-width: 220px;
  z-index: 30;
  padding: 8px 0;
`;

const SubMenuItem = styled.div`
  padding: 16px 24px;
  font-size: 1.1rem;
  cursor: pointer;
  background: ${({ active }) => (active ? '#f5f5f5' : 'transparent')};
  &:hover {
    background: #f5f5f5;
  }
`;

const CaregiverSearch = styled.input`
  width: 70%;
  margin: 12px 10%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  font-size: 1rem;
`;

export default function FilterDropdown({
  isOpen,
  onClose,
  activeFilter,
  onFilterChange,
  caregivers,
  caregiverSearch,
  onCaregiverSearchChange,
  hoveredFilter,
  onHoverFilter,
}) {
  if (!isOpen) return null;

  return (
    <DropdownMenu>
      <DropdownItem
        onMouseEnter={() => onHoverFilter('caregiver')}
        onMouseLeave={() => onHoverFilter(null)}
      >
        Caregiver <span style={{ marginLeft: 'auto' }}>›</span>
        {hoveredFilter === 'caregiver' && (
          <SubMenu>
            <CaregiverSearch
              placeholder='Search caregiver...'
              value={caregiverSearch}
              onChange={onCaregiverSearchChange}
            />
            {caregivers
              .filter((c) =>
                c.name.toLowerCase().includes(caregiverSearch.toLowerCase())
              )
              .map((c) => (
                <SubMenuItem
                  key={c.id}
                  onClick={() => {
                    onFilterChange({
                      type: 'caregiver',
                      value: c.id,
                    });
                    onClose();
                  }}
                >
                  {c.name}
                </SubMenuItem>
              ))}
          </SubMenu>
        )}
      </DropdownItem>
      <DropdownItem
        onMouseEnter={() => onHoverFilter('status')}
        onMouseLeave={() => onHoverFilter(null)}
      >
        Status <span style={{ marginLeft: 'auto' }}>›</span>
        {hoveredFilter === 'status' && (
          <SubMenu>
            {['Active', 'Inactive'].map((status) => (
              <SubMenuItem
                key={status}
                onClick={() => {
                  onFilterChange({
                    type: 'status',
                    value: status,
                  });
                  onClose();
                }}
              >
                {status}
              </SubMenuItem>
            ))}
          </SubMenu>
        )}
      </DropdownItem>
      {activeFilter.type && (
        <DropdownItem
          style={{ color: '#ef4444', fontWeight: 500 }}
          onClick={() => onFilterChange({ type: null, value: null })}
        >
          Clear Filter
        </DropdownItem>
      )}
    </DropdownMenu>
  );
}

FilterDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  activeFilter: PropTypes.shape({
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  caregivers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  caregiverSearch: PropTypes.string.isRequired,
  onCaregiverSearchChange: PropTypes.func.isRequired,
  hoveredFilter: PropTypes.string,
  onHoverFilter: PropTypes.func.isRequired,
};

FilterDropdown.defaultProps = {
  hoveredFilter: null,
};
