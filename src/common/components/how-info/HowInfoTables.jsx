import React, { useState } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

const TableContainer = styled.div`
  padding: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  border: 0.5px solid #ececec;
  background: #005696;
  color: #fff;
  padding: 8px;
  text-align: left;
  &:first-child {
    border-top-left-radius: 10px;
  }
  &:last-child {
    border-top-right-radius: 10px;
  }
`;

const TableCell = styled.td`
  padding: 8px;
  border: 0.5px solid #ececec;
  background: #fff;
`;

const EditButton = styled.button`
  background: #218bda;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  cursor: pointer;
`;

const AddButton = styled.button`
  background-color: #005696;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 20px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 1rem;
  &:hover {
    background-color: #218bda;
  }
`;

const FormContainer = styled.div`
  padding: 1rem;
  margin-top: 1rem;
`;

const FormTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: #333;
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 140px;
`;

const Label = styled.label`
  font-weight: 500;
  margin-bottom: 0.25rem;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  min-width: 140px;
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  min-width: 140px;
`;

const SaveButton = styled(AddButton)`
  background-color: #28a745;
  margin: 0.2rem;
  &:hover {
    background-color: #218838;
  }
`;

const CancelButton = styled(EditButton)`
  background-color: #6c757d;
  margin: 0.2rem;
  &:hover {
    background-color: #5a6268;
  }
`;

const DeleteButton = styled(EditButton)`
  background-color: #dc3545;
  margin: 0.2rem;
  &:hover {
    background-color: #c82333;
  }
`;
const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
`;
// Helper function to build API URLs
const buildUrl = (endpoint) =>
  `${process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '')}${endpoint}`;

// Individual row component that manages its own editing state
function TableRow({ row, columns, tableType, participantId, onDataUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState({});

  const startEdit = () => {
    setIsEditing(true);
    setEditingData({ ...row });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingData({});
  };

  const saveEdit = async () => {
    try {
      let tableName = '';
      switch (tableType) {
        case 'programs':
          tableName = 'participant_how_programs';
          break;
        case 'dataFields':
          tableName = 'participant_how_data_fields';
          break;
        case 'hospitalizations':
          tableName = 'participant_how_hospitalization';
          break;
        case 'falls':
          tableName = 'participant_how_falls';
          break;
        case 'toileting':
          tableName = 'participant_how_toileting';
          break;
        default:
          throw new Error('Unknown table type');
      }

      const endpoint = `/participants/${participantId}`;

      // Format data for the existing updateParticipant endpoint
      const requestBody = {
        [tableName]: editingData,
      };
      console.log('Request body:', requestBody);

      const response = await fetch(buildUrl(endpoint), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(
          `Failed to update record: ${response.status} ${errorText}`
        );
      }

      const responseData = await response.json();
      console.log('Success response:', responseData);

      setIsEditing(false);
      setEditingData({});
      onDataUpdate();
    } catch (err) {
      console.error('Error updating record:', err);
      alert(`Failed to update record: ${err.message}`);
    }
  };

  const deleteRow = async () => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      let tableName = '';
      switch (tableType) {
        case 'programs':
          tableName = 'participant_how_programs';
          break;
        case 'dataFields':
          tableName = 'participant_how_data_fields';
          break;
        case 'hospitalizations':
          tableName = 'participant_how_hospitalization';
          break;
        case 'falls':
          tableName = 'participant_how_falls';
          break;
        case 'toileting':
          tableName = 'participant_how_toileting';
          break;
        default:
          throw new Error('Unknown table type');
      }

      const endpoint = `/participants/${tableName}/${participantId}?entry_id=${row.entry_id}`;
      const response = await fetch(buildUrl(endpoint), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete record');
      }

      onDataUpdate(); // Refresh data after deletion
    } catch (err) {
      console.error('Error deleting record:', err);
      alert('Failed to delete record');
    }
  };

  const renderCell = (column) => {
    const value = row[column.key] || '';

    if (!isEditing) {
      // Display mode
      if (column.type === 'boolean') {
        return value ? 'Yes' : 'No';
      }
      return value;
    }

    // Edit mode
    switch (column.type) {
      case 'select':
        return (
          <Select
            value={editingData[column.key] || ''}
            onChange={(e) =>
              setEditingData({ ...editingData, [column.key]: e.target.value })
            }
          >
            {column.hasEmptyOption && <option value=''>Select</option>}
            {column.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        );

      case 'boolean':
        return (
          <Select
            value={editingData[column.key] ? 'Yes' : 'No'}
            onChange={(e) =>
              setEditingData({
                ...editingData,
                [column.key]: e.target.value === 'Yes',
              })
            }
          >
            <option value='Yes'>Yes</option>
            <option value='No'>No</option>
          </Select>
        );

      case 'date':
        return (
          <Input
            type='date'
            value={editingData[column.key] || ''}
            onChange={(e) =>
              setEditingData({ ...editingData, [column.key]: e.target.value })
            }
          />
        );

      case 'text':
      default:
        return (
          <Input
            type='text'
            value={editingData[column.key] || ''}
            onChange={(e) =>
              setEditingData({ ...editingData, [column.key]: e.target.value })
            }
          />
        );
    }
  };

  return (
    <tr key={row.entry_id}>
      <TableCell>
        {isEditing ? (
          <ButtonRow>
            <SaveButton onClick={saveEdit}>Save</SaveButton>
            <DeleteButton onClick={deleteRow}>Delete</DeleteButton>
            <CancelButton onClick={cancelEdit}>Cancel</CancelButton>
          </ButtonRow>
        ) : (
          <EditButton onClick={startEdit}>Edit</EditButton>
        )}
      </TableCell>
      {columns.map((column) => (
        <TableCell key={column.key}>{renderCell(column)}</TableCell>
      ))}
    </tr>
  );
}

TableRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    entry_id: PropTypes.string.isRequired, // entry_id is used for deletion
  }).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string),
      hasEmptyOption: PropTypes.bool,
    })
  ).isRequired,
  tableType: PropTypes.string.isRequired,
  participantId: PropTypes.string.isRequired,
  onDataUpdate: PropTypes.func.isRequired,
};

export default function HowInfoTable({
  title,
  data,
  columns,
  tableType,
  participantId,
  onDataUpdate,
  newRecordForm,
}) {
  // Remove all editing state from the main component
  // Each row now manages its own state independently

  const addNewRecord = async (newRecordData) => {
    try {
      console.log(
        'Adding new record for table type:',
        tableType,
        'with data:',
        newRecordData
      );

      let tableName = '';
      switch (tableType) {
        case 'programs':
          tableName = 'participant_how_programs';
          break;
        case 'dataFields':
          tableName = 'participant_how_data_fields';
          break;
        case 'hospitalizations':
          tableName = 'participant_how_hospitalization';
          break;
        case 'falls':
          tableName = 'participant_how_falls';
          break;
        case 'toileting':
          tableName = 'participant_how_toileting';
          break;
        default:
          throw new Error('Unknown table type');
      }

      const endpoint = `/participants/${participantId}`;
      console.log('Making PUT request to:', buildUrl(endpoint));

      // Format data for the existing updateParticipant endpoint
      const requestBody = {
        [tableName]: newRecordData,
      };
      console.log('Request body:', requestBody);

      const response = await fetch(buildUrl(endpoint), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(
          `Failed to add record: ${response.status} ${errorText}`
        );
      }

      const responseData = await response.json();
      console.log('Success response:', responseData);

      onDataUpdate();
    } catch (err) {
      console.error('Error adding record:', err);
      alert(`Failed to add record: ${err.message}`);
    }
  };

  return (
    <div>
      <TableContainer>
        <h3>{title}</h3>
        <Table>
          <thead>
            <tr>
              <TableHeader></TableHeader>
              {columns.map((column) => (
                <TableHeader key={column.key}>{column.label}</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <TableRow
                key={row.entry_id}
                row={row}
                columns={columns}
                tableType={tableType}
                participantId={participantId}
                onDataUpdate={onDataUpdate}
              />
            ))}
          </tbody>
        </Table>
      </TableContainer>

      {newRecordForm && (
        <FormContainer>
          <FormTitle>New {title.replace(/s$/, '')}</FormTitle>
          {React.cloneElement(newRecordForm, { onAdd: addNewRecord })}
        </FormContainer>
      )}
    </div>
  );
}

HowInfoTable.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string),
      hasEmptyOption: PropTypes.bool,
    })
  ).isRequired,
  tableType: PropTypes.string.isRequired,
  participantId: PropTypes.string.isRequired,
  onDataUpdate: PropTypes.func.isRequired,
  newRecordForm: PropTypes.element,
};

// Form Components for each table type
export function ProgramForm({ onAdd }) {
  console.log('ProgramForm rendered with onAdd:', onAdd);

  const [formData, setFormData] = useState({
    program_type: '',
    first_call: '',
    first_day: '',
    referral: '',
    discharge_date: '',
    discharge_reason: '',
  });

  const programOptions = ['Day Program', 'Mind Matters', 'Both', 'Other'];
  const referralOptions = [
    "Alzheimer's Association",
    'CommunityEd',
    'Family member',
    'Friend',
    'Home care agency',
    'Hospital',
    'HOW program',
    'Other',
  ];
  const dischargeReasonOptions = [
    'Assisted living',
    'Caregiver death',
    'Caregiver illness',
    'Does not meet program criteria',
    'Goals/Services completed',
    'Home care',
    'Moved or relocated',
    'Self-discharge',
    'Respite',
    'Other',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('ProgramForm handleSubmit called with data:', formData);
    console.log('onAdd function:', onAdd);

    // Validate required fields
    if (!formData.program_type) {
      alert('Please fill out all fields.');
      return;
    }

    onAdd(formData);
    setFormData({
      program_type: '',
      first_call: '',
      first_day: '',
      referral: '',
      discharge_date: '',
      discharge_reason: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormRow>
        <FormGroup>
          <Label>Program:</Label>
          <Select
            value={formData.program_type}
            onChange={(e) =>
              setFormData({ ...formData, program_type: e.target.value })
            }
          >
            <option value=''>Select Program</option>
            {programOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>First Call:</Label>
          <Input
            type='date'
            value={formData.first_call}
            onChange={(e) =>
              setFormData({ ...formData, first_call: e.target.value })
            }
          />
        </FormGroup>

        <FormGroup>
          <Label>First Day:</Label>
          <Input
            type='date'
            value={formData.first_day}
            onChange={(e) =>
              setFormData({ ...formData, first_day: e.target.value })
            }
          />
        </FormGroup>

        <FormGroup>
          <Label>Referral:</Label>
          <Select
            value={formData.referral}
            onChange={(e) =>
              setFormData({ ...formData, referral: e.target.value })
            }
          >
            <option value=''>Select</option>
            {referralOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Discharge Date:</Label>
          <Input
            type='date'
            value={formData.discharge_date}
            onChange={(e) =>
              setFormData({ ...formData, discharge_date: e.target.value })
            }
          />
        </FormGroup>

        <FormGroup>
          <Label>Discharge Reason:</Label>
          <Select
            value={formData.discharge_reason}
            onChange={(e) =>
              setFormData({ ...formData, discharge_reason: e.target.value })
            }
          >
            <option value=''>Select</option>
            {dischargeReasonOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormGroup>

        <AddButton type='submit'>Add</AddButton>
      </FormRow>
    </form>
  );
}

ProgramForm.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export function DataFieldForm({ onAdd }) {
  const [formData, setFormData] = useState({
    data_field: '',
    data_value: '',
    date_changed: '',
  });

  const dataFieldOptions = [
    'Select sources of funding',
    'Caregiver relationship',
    'Insurance type',
    'Primary care physician',
    'Emergency contact',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    if (
      !formData.data_field ||
      formData.data_field === 'Select sources of funding'
    ) {
      alert('Please fill out all fields.');
      return;
    }
    if (!formData.data_value || !formData.date_changed) {
      alert('Please fill out all fields.');
      return;
    }
    onAdd(formData);
    setFormData({
      data_field: '',
      data_value: '',
      date_changed: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormRow>
        <FormGroup>
          <Label>Data Field:</Label>
          <Select
            value={formData.data_field}
            onChange={(e) =>
              setFormData({ ...formData, data_field: e.target.value })
            }
          >
            {dataFieldOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Value:</Label>
          <Input
            type='text'
            value={formData.data_value}
            onChange={(e) =>
              setFormData({ ...formData, data_value: e.target.value })
            }
          />
        </FormGroup>

        <FormGroup>
          <Label>Date Changed:</Label>
          <Input
            type='date'
            value={formData.date_changed}
            onChange={(e) =>
              setFormData({ ...formData, date_changed: e.target.value })
            }
          />
        </FormGroup>

        <AddButton type='submit'>Add</AddButton>
      </FormRow>
    </form>
  );
}

DataFieldForm.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export function HospitalizationForm({ onAdd }) {
  const [formData, setFormData] = useState({
    incident_date: '',
    hospitalization: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.incident_date) {
      alert('Please fill out all fields.');
      return;
    }

    onAdd(formData);
    setFormData({
      incident_date: '',
      hospitalization: true,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormRow>
        <FormGroup>
          <Label>Date:</Label>
          <Input
            type='date'
            value={formData.incident_date}
            onChange={(e) =>
              setFormData({ ...formData, incident_date: e.target.value })
            }
          />
        </FormGroup>

        <FormGroup>
          <Label>Hospitalization?</Label>
          <Select
            value={formData.hospitalization ? 'Yes' : 'No'}
            onChange={(e) =>
              setFormData({
                ...formData,
                hospitalization: e.target.value === 'Yes',
              })
            }
          >
            <option value='Yes'>Yes</option>
            <option value='No'>No</option>
          </Select>
        </FormGroup>

        <AddButton type='submit'>Add</AddButton>
      </FormRow>
    </form>
  );
}

HospitalizationForm.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export function FallForm({ onAdd }) {
  const [formData, setFormData] = useState({
    fall_date: '',
    fall_in_program: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.fall_date) {
      alert('Please fill out all fields.');
      return;
    }

    onAdd(formData);
    setFormData({
      fall_date: '',
      fall_in_program: true,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormRow>
        <FormGroup>
          <Label>Date:</Label>
          <Input
            type='date'
            value={formData.fall_date}
            onChange={(e) =>
              setFormData({ ...formData, fall_date: e.target.value })
            }
          />
        </FormGroup>

        <FormGroup>
          <Label>In Program?</Label>
          <Select
            value={formData.fall_in_program ? 'Yes' : 'No'}
            onChange={(e) =>
              setFormData({
                ...formData,
                fall_in_program: e.target.value === 'Yes',
              })
            }
          >
            <option value='Yes'>Yes</option>
            <option value='No'>No</option>
          </Select>
        </FormGroup>

        <AddButton type='submit'>Add</AddButton>
      </FormRow>
    </form>
  );
}

FallForm.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export function ToiletingForm({ onAdd }) {
  const [formData, setFormData] = useState({
    date: '',
    type: 'B.M.',
    assistance: true,
  });

  const toiletingTypeOptions = ['B.M.', 'Urination', 'Both'];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.date) {
      alert('Please fill out all fields.');
      return;
    }

    onAdd(formData);
    setFormData({
      date: '',
      type: 'B.M.',
      assistance: true,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormRow>
        <FormGroup>
          <Label>Date:</Label>
          <Input
            type='date'
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </FormGroup>

        <FormGroup>
          <Label>Type:</Label>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            {toiletingTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Assistance?</Label>
          <Select
            value={formData.assistance ? 'Yes' : 'No'}
            onChange={(e) =>
              setFormData({ ...formData, assistance: e.target.value === 'Yes' })
            }
          >
            <option value='Yes'>Yes</option>
            <option value='No'>No</option>
          </Select>
        </FormGroup>

        <AddButton type='submit'>Add</AddButton>
      </FormRow>
    </form>
  );
}

ToiletingForm.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
