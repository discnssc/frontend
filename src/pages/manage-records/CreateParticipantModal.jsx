import React from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Button } from 'common/components/Button';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  font-size: 1rem;
`;

const ModalSelect = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  font-size: 1rem;
`;

const ModalButton = styled(Button.Primary)`
  width: 100%;
  margin-top: 8px;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

export default function CreateParticipantModal({
  isOpen,
  onClose,
  onSubmit,
  firstName,
  lastName,
  status,
  onFirstNameChange,
  onLastNameChange,
  onStatusChange,
}) {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalClose onClick={onClose} title='Close'>
          ×
        </ModalClose>
        <ModalTitle>Create New Participant</ModalTitle>
        <form onSubmit={onSubmit}>
          <ModalInput
            placeholder='First Name'
            value={firstName}
            onChange={onFirstNameChange}
            required
          />
          <ModalInput
            placeholder='Last Name'
            value={lastName}
            onChange={onLastNameChange}
            required
          />
          <ModalSelect value={status} onChange={onStatusChange}>
            <option value='Active'>Active</option>
            <option value='Inactive'>Inactive</option>
          </ModalSelect>
          <ModalButton type='submit'>Create</ModalButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

CreateParticipantModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  onFirstNameChange: PropTypes.func.isRequired,
  onLastNameChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};
