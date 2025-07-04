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
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  text-align: center;
`;

const ConfirmName = styled.div`
  font-weight: bold;
  font-size: 1.3rem;
  margin: 12px 0 8px 0;
`;

const ConfirmButton = styled(Button.Primary)`
  width: 140px;
  font-size: 1.1rem;
  margin: 0 18px 0 0;
  display: inline-block;
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  color: #005696;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 8px;
`;

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  participant,
}) {
  if (!isOpen || !participant) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <div style={{ fontSize: '1.15rem', marginBottom: 8 }}>
          You are about to delete
          <br />
          all participant info for:
        </div>
        <ConfirmName>
          {participant.participant_general_info?.first_name}{' '}
          {participant.participant_general_info?.last_name}
        </ConfirmName>
        <div style={{ marginBottom: 24 }}>This action cannot be undone.</div>
        <ConfirmButton onClick={onConfirm}>Confirm</ConfirmButton>
        <CancelButton onClick={onClose}>Cancel</CancelButton>
      </ModalContent>
    </ModalOverlay>
  );
}

DeleteConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  participant: PropTypes.shape({
    participant_general_info: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
    }),
  }),
};

DeleteConfirmModal.defaultProps = {
  participant: null,
};
