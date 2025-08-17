import React from 'react';

import PropTypes from 'prop-types';

import { Button } from 'common/components/Button';

import {
  AddButton,
  AddButtonContainer,
  CancelButton,
  CodeSelect,
  EmptyStateCell,
  ModalContainer,
  ModalOverlay,
  ModalTitle,
  NoParticipantsMessage,
  ParticipantItem,
  ParticipantsList,
  SaveButton,
  SearchInput,
  StyledTable,
  TableCell,
  TableContainer,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TimeInput,
} from './AttendanceDashboard.styles';

function AttendanceTable({
  title,
  data,
  onAddUnscheduled,
  onSaveRow,
  editable = true,
}) {
  const [rowEdits, setRowEdits] = React.useState({});

  const handleEdit = (row, field, value) => {
    setRowEdits((prev) => ({
      ...prev,
      [row.id]: {
        ...prev[row.id],
        [field]: value,
      },
    }));
  };

  const handleSave = (row) => {
    const edits = rowEdits[row.id] || {};
    onSaveRow({ ...row, ...edits });
    setRowEdits((prev) => ({ ...prev, [row.id]: undefined }));
  };

  const getValue = (row, field) =>
    rowEdits[row.id]?.[field] !== undefined
      ? rowEdits[row.id][field]
      : row[field] || '';

  return (
    <TableContainer>
      <TableHeader>{title}</TableHeader>
      <StyledTable>
        <thead>
          <tr>
            {['Name', 'R/A', 'In', 'Out', 'Code', 'Save'].map((col) => (
              <TableHeaderCell key={col}>{col}</TableHeaderCell>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <EmptyStateCell colSpan={6}>
                No participants scheduled.
              </EmptyStateCell>
            </tr>
          ) : (
            data.map((row, idx) => (
              <TableRow key={row.id || idx} index={idx}>
                <TableCell>{row.name}</TableCell>
                <TableCell align='center'>{row.toileting || ''}</TableCell>
                <TableCell align='center'>
                  {editable ? (
                    <TimeInput
                      type='time'
                      value={getValue(row, 'in')}
                      onChange={(e) => handleEdit(row, 'in', e.target.value)}
                    />
                  ) : (
                    row.in || ''
                  )}
                </TableCell>
                <TableCell align='center'>
                  {editable ? (
                    <TimeInput
                      type='time'
                      value={getValue(row, 'out')}
                      onChange={(e) => handleEdit(row, 'out', e.target.value)}
                    />
                  ) : (
                    row.out || ''
                  )}
                </TableCell>
                <TableCell align='center'>
                  {editable ? (
                    <CodeSelect
                      value={getValue(row, 'code')}
                      onChange={(e) => handleEdit(row, 'code', e.target.value)}
                    >
                      <option value=''>Select</option>
                      {[...'ABCDEF'].map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </CodeSelect>
                  ) : (
                    row.code || ''
                  )}
                </TableCell>
                <TableCell align='center'>
                  <SaveButton
                    as={Button.Primary}
                    onClick={() => handleSave(row)}
                    disabled={!rowEdits[row.id]}
                  >
                    Save
                  </SaveButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </tbody>
      </StyledTable>
      {onAddUnscheduled && (
        <AddButtonContainer>
          <AddButton onClick={onAddUnscheduled}>
            Add Unscheduled Participant
          </AddButton>
        </AddButtonContainer>
      )}
    </TableContainer>
  );
}

AttendanceTable.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
      toileting: PropTypes.string,
      in: PropTypes.string,
      out: PropTypes.string,
      code: PropTypes.string,
    })
  ).isRequired,
  onAddUnscheduled: PropTypes.func,
  onSaveRow: PropTypes.func.isRequired,
  editable: PropTypes.bool,
};

export default AttendanceTable;

export const AddUnscheduledModal = React.memo(function AddUnscheduledModal({
  search,
  setSearch,
  getAvailableParticipants,
  handleSelectParticipant,
  setShowModal,
}) {
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalTitle>Add Unscheduled Participant</ModalTitle>
        <SearchInput
          type='text'
          placeholder='Search by name...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ParticipantsList>
          {getAvailableParticipants().length === 0 ? (
            <NoParticipantsMessage>
              No participants found.
            </NoParticipantsMessage>
          ) : (
            getAvailableParticipants().map((p) => (
              <ParticipantItem
                key={p.id}
                onClick={() => handleSelectParticipant(p)}
              >
                {p.participant_general_info?.first_name}{' '}
                {p.participant_general_info?.last_name}
              </ParticipantItem>
            ))
          )}
        </ParticipantsList>
        <CancelButton onClick={() => setShowModal(false)}>Cancel</CancelButton>
      </ModalContainer>
    </ModalOverlay>
  );
});

AddUnscheduledModal.propTypes = {
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  getAvailableParticipants: PropTypes.func.isRequired,
  handleSelectParticipant: PropTypes.func.isRequired,
  setShowModal: PropTypes.func.isRequired,
};
