import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const ActivityTitle = styled.h1`
  font-size: 30px;
  font-weight: bold;
`;
const ActivityPage = styled.div`
  flex-direction: column;
  justify-content: left;
  align-items: left;
  text-align: left;
  padding: 2rem;
  background-color: #ececec;
`;
const ActivityInfo = styled.div`
  font-size: 15px;
  margin-bottom: 3rem;
  margin-top: 1rem;
`;
const Table = styled.table`
  width: auto;
  border-collapse: collapse;
  table-layout: fixed;
  vertical-align: top;
  margin-top: 2rem;
  overflow: hidden;
`;

const TableRow = styled.tr`
  width: 100%;
  font-size: 15px;
`;

const LableTableCell = styled.td`
  padding: 15px;
  text-align: left;
  vertical-align: middle;
  background: #005696;
  color: #ffffff;
  justify-content: center;
  flex-shrink: 0;
  font-weight: bold;
  &:not(:last-child) {
    border-right: 0.5px solid #ececec;
  }
  &:first-child {
    border-top-left-radius: 10px;
  }
  &:last-child {
    border-top-right-radius: 10px;
  }
`;
const TableCell = styled.td`
  padding: 15px;
  text-align: left;
  vertical-align: middle;
  background-color: #ffffff;
  border: 0.5px solid #ececec;
  justify-content: center;
  flex-shrink: 0;
`;
const Button = styled.button`
  background-color: #005696;
  color: #ececec;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background-color: #218bda;
  }
`;

const InputBox = styled.input`
  padding: 5px;
  border: 0px;
  &:focus {
    outline: 1px solid #ececec;
  }
`;

const SearchBox = styled.input`
  padding: 15px 70px 15px 20px;
  color: #aaaaaa;
  font-size: 15px;
  border: 0px;
  border-radius: 30px;
  background-color: #ffffff;
  font-style: italic;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #aaaaaa;
    font-style: italic;
  }
`;
const ErrorMessage = styled.div`
  color: red;
  font-size: 15px;
  margin-top: 10px;
`;
const buildUrl = (endpoint) =>
  `${process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '')}${endpoint}`;

const formatTimeIn12Hour = (time) => {
  if (!time) return '';
  return new Date(`2025-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
const ViewActivity = () => {
  const { activityId } = useParams();
  const [activity, setActivity] = useState(null);
  const [allParticipants, setAllParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchActivityData = async () => {
    try {
      const activityResponse = await fetch(
        buildUrl(`/activities/${activityId}`)
      );
      const activityData = await activityResponse.json();
      const participantsResponse = await fetch(buildUrl(`/participants`));
      const participantsData = await participantsResponse.json();

      setActivity(activityData);
      setAllParticipants(participantsData);
      setFilteredParticipants(participantsData);

      const attendanceMap = {};
      const activityLogs = activityData?.activity_logs || [];

      activityLogs.forEach((activityLog) => {
        const participantId = activityLog.participant?.id;
        if (participantId) {
          attendanceMap[participantId] = {
            declined: activityLog.declined,
            rating: activityLog.rating,
            notes: activityLog.notes,
          };
        }
      });

      setAttendance(attendanceMap);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityData();
  }, [activityId]);

  useEffect(() => {
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = allParticipants.filter((participant) => {
        const fullName = `${participant.participant_general_info?.first_name || ''} ${
          participant.participant_general_info?.last_name || ''
        }`;
        return fullName.toLowerCase().includes(searchTermLower);
      });
      setFilteredParticipants(filtered);
    } else {
      setFilteredParticipants(allParticipants);
    }
  }, [searchTerm, allParticipants]);

  if (loading) return <div>Loading...</div>;
  if (!activity) return <div>Activity not found</div>;

  const handleChange = (participantId, field, value) => {
    setAttendance((prev) => ({
      ...prev,
      [participantId]: {
        ...prev[participantId],
        [field]: value,
      },
    }));
  };

  const updateActivityLogs = async () => {
    const payload = allParticipants.map((participant) => {
      const activityLog = attendance[participant.id] || {};
      return {
        participantId: participant.id,
        declined: activityLog.declined ?? false,
        rating: activityLog.rating ?? null,
        notes: activityLog.notes ?? null,
      };
    });

    try {
      console.log('Submitting payload:', payload);
      const recordAttendanceResponse = await fetch(
        buildUrl(`/activities/${activityId}/attendance`),
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const result = await recordAttendanceResponse.json();
      if (!recordAttendanceResponse.ok) {
        setError(result.message || 'Failed to save attendance');
      } else {
        fetchActivityData();
      }
    } catch (err) {
      console.error('Error updating attendance:', err);
      setError(err || 'Failed to save attendance');
    }
  };
  return (
    <ActivityPage>
      <ActivityTitle>{activity.name}</ActivityTitle>
      <ActivityInfo>
        <p>
          <strong>Date:</strong> {activity.date}
        </p>
        <p>
          <strong>Time:</strong> {formatTimeIn12Hour(activity.time_start)} -{' '}
          {formatTimeIn12Hour(activity.time_end)}
        </p>
      </ActivityInfo>
      <SearchBox
        type='text'
        placeholder='Search participants...'
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      <Table>
        <TableRow>
          <LableTableCell>Name</LableTableCell>
          <LableTableCell>Declined?</LableTableCell>
          <LableTableCell>Rating</LableTableCell>
          <LableTableCell>Notes</LableTableCell>
        </TableRow>
        <tbody>
          {filteredParticipants.map((participant) => {
            const activityLog = attendance[participant.id] || {};
            return (
              <TableRow key={participant.id}>
                <TableCell>
                  {participant.participant_general_info?.first_name || 'N/A'}{' '}
                  {participant.participant_general_info?.last_name || ''}
                </TableCell>
                <TableCell>
                  <InputBox
                    type='checkbox'
                    checked={activityLog.declined || false}
                    onChange={(e) =>
                      handleChange(participant.id, 'declined', e.target.checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <InputBox
                    type='number'
                    min='-3'
                    max='3'
                    value={activityLog.rating === '' ? '' : activityLog.rating}
                    onChange={(e) =>
                      handleChange(
                        participant.id,
                        'rating',
                        e.target.value === '' ? null : Number(e.target.value)
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <InputBox
                    type='text'
                    value={activityLog.notes || ''}
                    onChange={(e) =>
                      handleChange(participant.id, 'notes', e.target.value)
                    }
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </tbody>
      </Table>

      <Button onClick={updateActivityLogs}>Update Attendance</Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </ActivityPage>
  );
};

export default ViewActivity;
