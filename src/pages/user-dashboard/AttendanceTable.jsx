import React from 'react';

import PropTypes from 'prop-types';

import { Button } from 'common/components/Button';

function AttendanceTable({
  title,
  data,
  onAddUnscheduled,
  onSaveRow,
  editable = true,
}) {
  // Local state for AM/PM toggles and time values
  const [rowEdits, setRowEdits] = React.useState({});

  // Handle time or AM/PM change
  const handleEdit = (row, field, value) => {
    setRowEdits((prev) => ({
      ...prev,
      [row.id]: {
        ...prev[row.id],
        [field]: value,
      },
    }));
  };

  // When Save is clicked, call onSaveRow with the edited row
  const handleSave = (row) => {
    const edits = rowEdits[row.id] || {};
    onSaveRow({ ...row, ...edits });
    setRowEdits((prev) => ({ ...prev, [row.id]: undefined }));
  };

  // Helper to get value (edited or original)
  const getValue = (row, field) =>
    rowEdits[row.id]?.[field] !== undefined
      ? rowEdits[row.id][field]
      : row[field] || '';

  return (
    <div style={{ marginBottom: 48 }}>
      <div
        style={{
          background: 'rgb(0, 86, 150)',
          color: 'white',
          padding: '10px 16px',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          fontWeight: 600,
          fontSize: '1.1rem',
        }}
      >
        {title}
      </div>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: 'white',
          borderRadius: 8,
          overflow: 'hidden',
          fontSize: '1.08rem',
        }}
      >
        <thead>
          <tr>
            {['Name', 'R/A', 'In', 'Out', 'Code', 'Save'].map((col) => (
              <th
                key={col}
                style={{
                  padding: '12px 10px',
                  background: 'rgb(0, 86, 150)',
                  color: 'white',
                  fontWeight: 500,
                  border: '1px solid #d0d0d0',
                  textAlign: 'center',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                style={{
                  textAlign: 'center',
                  color: '#888',
                  padding: 24,
                  border: '1px solid #e0e0e0',
                  background: '#fff',
                  fontSize: '1.08rem',
                }}
              >
                No participants scheduled.
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row.id || idx}
                style={{
                  background: idx % 2 === 0 ? '#f9fbfd' : 'white',
                  transition: 'background 0.2s',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = '#eaf2fa')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background =
                    idx % 2 === 0 ? '#f9fbfd' : 'white')
                }
              >
                <td
                  style={{
                    padding: '12px 10px',
                    border: '1px solid #e0e0e0',
                    verticalAlign: 'middle',
                    textAlign: 'left',
                  }}
                >
                  {row.name}
                </td>
                <td
                  style={{
                    padding: '12px 10px',
                    border: '1px solid #e0e0e0',
                    verticalAlign: 'middle',
                    textAlign: 'center',
                  }}
                >
                  {row.toileting || ''}
                </td>
                <td
                  style={{
                    padding: '12px 10px',
                    border: '1px solid #e0e0e0',
                    verticalAlign: 'middle',
                    textAlign: 'center',
                  }}
                >
                  {editable ? (
                    <input
                      type='time'
                      value={getValue(row, 'in')}
                      onChange={(e) => handleEdit(row, 'in', e.target.value)}
                      style={{
                        width: 120,
                        fontSize: '1rem',
                        padding: '4px 6px',
                      }}
                    />
                  ) : (
                    row.in || ''
                  )}
                </td>
                <td
                  style={{
                    padding: '12px 10px',
                    border: '1px solid #e0e0e0',
                    verticalAlign: 'middle',
                    textAlign: 'center',
                  }}
                >
                  {editable ? (
                    <input
                      type='time'
                      value={getValue(row, 'out')}
                      onChange={(e) => handleEdit(row, 'out', e.target.value)}
                      style={{
                        width: 120,
                        fontSize: '1rem',
                        padding: '4px 6px',
                      }}
                    />
                  ) : (
                    row.out || ''
                  )}
                </td>
                <td
                  style={{
                    padding: '12px 10px',
                    border: '1px solid #e0e0e0',
                    verticalAlign: 'middle',
                    textAlign: 'center',
                  }}
                >
                  {editable ? (
                    <select
                      value={getValue(row, 'code')}
                      onChange={(e) => handleEdit(row, 'code', e.target.value)}
                      style={{
                        width: 70,
                        padding: 4,
                        borderRadius: 4,
                        border: '1px solid #ccc',
                        fontSize: '1rem',
                      }}
                    >
                      <option value=''>Select</option>
                      <option value='A'>A</option>
                      <option value='B'>B</option>
                      <option value='C'>C</option>
                      <option value='D'>D</option>
                      <option value='E'>E</option>
                      <option value='F'>F</option>
                    </select>
                  ) : (
                    row.code || ''
                  )}
                </td>
                <td
                  style={{
                    padding: '12px 10px',
                    border: '1px solid #e0e0e0',
                    verticalAlign: 'middle',
                    textAlign: 'center',
                  }}
                >
                  <Button.Primary
                    onClick={() => handleSave(row)}
                    disabled={!rowEdits[row.id]}
                  >
                    Save
                  </Button.Primary>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {onAddUnscheduled && (
        <div style={{ marginTop: 12, textAlign: 'right' }}>
          <Button.Primary onClick={onAddUnscheduled}>
            <span role='img' aria-label='add'>
              ➕
            </span>{' '}
            Add Unscheduled Participant
          </Button.Primary>
        </div>
      )}
    </div>
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
