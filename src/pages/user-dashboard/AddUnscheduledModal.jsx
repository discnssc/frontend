import React from 'react';

import PropTypes from 'prop-types';

/**
 * Modal for adding an unscheduled participant.
 * @param {Object} props
 * @param {string} props.search
 * @param {function} props.setSearch
 * @param {function} props.getAvailableParticipants
 * @param {function} props.handleSelectParticipant
 * @param {function} props.setShowModal
 */
const AddUnscheduledModal = React.memo(function AddUnscheduledModal({
  search,
  setSearch,
  getAvailableParticipants,
  handleSelectParticipant,
  setShowModal,
}) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.2)',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 12,
          padding: 32,
          minWidth: 340,
          boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Add Unscheduled Participant</h3>
        <input
          type='text'
          placeholder='Search by name...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 6,
            border: '1px solid #ccc',
            marginBottom: 16,
          }}
        />
        <div style={{ maxHeight: 220, overflowY: 'auto' }}>
          {getAvailableParticipants().length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center' }}>
              No participants found.
            </div>
          ) : (
            getAvailableParticipants().map((p) => (
              <div
                key={p.id}
                style={{
                  padding: 10,
                  cursor: 'pointer',
                  borderRadius: 6,
                  marginBottom: 4,
                  background: '#f7f7f7',
                }}
                onClick={() => handleSelectParticipant(p)}
              >
                {p.participant_general_info?.first_name}{' '}
                {p.participant_general_info?.last_name}
              </div>
            ))
          )}
        </div>
        <button
          style={{
            marginTop: 18,
            padding: '8px 18px',
            borderRadius: 6,
            border: 'none',
            background: '#005699',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
});

AddUnscheduledModal.propTypes = {
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  getAvailableParticipants: PropTypes.func.isRequired,
  handleSelectParticipant: PropTypes.func.isRequired,
  setShowModal: PropTypes.func.isRequired,
};

export default AddUnscheduledModal;
