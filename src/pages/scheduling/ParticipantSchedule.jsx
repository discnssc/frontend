import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AdminNavBar from 'common/components/navigation/AdminNavBar';
import { Button } from 'common/components/Button';
import LogoutModal from 'common/components/navigation/LogoutModal';

// API base URL from environment
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const Container = styled.div`
  background: #f2f2f2;
  min-height: 100vh;
  padding-bottom: 40px;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 0 0 0;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 16px;
  margin-top: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: bold;
  margin: 32px 0 16px 0;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 18px;
  margin-top: 8px;
`;

const Input = styled.input`
  padding: 12px 18px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  font-size: 1rem;
  background: #fff;
  min-width: 200px;
`;

const Select = styled.select`
  padding: 12px 18px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  font-size: 1rem;
  background: #fff;
`;

const PrintButton = styled(Button.Primary)`
  margin-left: auto;
  display: block;
  height: 48px;
  font-size: 1.1rem;
  border-radius: 8px;
`;

const TabSwitcher = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 16px;
  align-items: center;
  margin-top: 8px;
`;

const Tab = styled.button`
  background: none;
  border: none;
  color: ${({ active }) => (active ? 'rgb(0, 86, 150)' : '#222')};
  font-size: 1.15rem;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  padding: 0 0 8px 0;
  border-bottom: ${({ active }) => (active ? '4px solid rgb(0, 86, 150)' : '4px solid transparent')};
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.2s, border-bottom 0.2s;
  span {
    margin-right: 8px;
    font-size: 1.2em;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const Th = styled.th`
  background: rgb(0, 86, 150);
  color: white;
  padding: 14px 8px;
  font-size: 1rem;
  font-weight: bold;
  text-align: left;
`;

const Td = styled.td`
  background: white;
  padding: 12px 8px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 1rem;
`;

const Pill = styled.span`
  display: inline-block;
  padding: 4px 14px;
  border-radius: 16px;
  font-size: 0.95em;
  font-weight: 500;
  color: ${({ type }) => {
    if (type === 'AM') return '#b26a00';
    if (type === 'PM') return '#a1006b';
    if (type === 'Full-Day') return '#0056b3';
    return '#333';
  }};
  background: ${({ type }) => {
    if (type === 'AM') return '#ffe5c2';
    if (type === 'PM') return '#f9c7e7';
    if (type === 'Full-Day') return '#d2e6fa';
    return '#eee';
  }};
`;

const EditIcon = styled.span`
  font-size: 1.2em;
  margin-right: 8px;
  cursor: pointer;
`;

// Modal styles (reused from LogoutModal)
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;
const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;
const DayRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;
const DayLabel = styled.label`
  min-width: 80px;
  font-weight: 500;
`;
const Checkbox = styled.input`
  margin-right: 8px;
`;
const Radio = styled.input`
  margin: 0 6px 0 0;
`;
const ToiletingRow = styled.div`
  margin-top: 18px;
  margin-bottom: 18px;
`;
const SaveButton = styled(Button.Primary)`
  margin-top: 18px;
  width: 100%;
`;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['AM', 'PM', 'Full'];
const TOILETING = ['Remind', 'Assist', 'R/A', 'None'];

/**
 * Format a schedule object into a string, always in Monday-Friday order.
 * @param {object} schedule - The schedule JSON object from the DB.
 * @returns {string} - Human-readable schedule string.
 */
function formatSchedule(schedule) {
  if (!schedule || typeof schedule !== 'object') return '';
  return DAYS
    .filter(day => schedule[day] && schedule[day].active)
    .map(day => {
      let shortDay = day.slice(0, 3);
      if (shortDay === 'Thu') shortDay = 'Thur';
      let time = schedule[day].time === 'Full' ? 'Full' : schedule[day].time;
      return `${shortDay} (${time})`;
    })
    .join(', ');
}

/**
 * Format the toileting value for display.
 * @param {string} val - Toileting value from DB.
 * @returns {string} - Short display value.
 */
function formatToileting(val) {
  if (!val || val === 'None') return '';
  if (val === 'Remind') return 'R';
  if (val === 'Assist') return 'A';
  if (val === 'R/A') return 'R/A';
  return val;
}

/**
 * Main component for the Participant Schedule and Attendance page.
 * Handles fetching, displaying, and editing participant schedules.
 */
export default function ParticipantSchedule() {
  // UI state
  const [activeTab, setActiveTab] = useState('Attendance');
  const [month, setMonth] = useState('March');
  const [startDay, setStartDay] = useState(1);
  const [endDay, setEndDay] = useState(31);
  const [year, setYear] = useState(2025);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('None');
  const [sort, setSort] = useState('Date');

  // Data state
  const [participants, setParticipants] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal state for editing
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editSchedule, setEditSchedule] = useState({});
  const [editToileting, setEditToileting] = useState('Remind');

  // Add attendance state
  const [attendance, setAttendance] = useState([]);

  // Fetch participants, schedules, and attendance on mount or when Schedule/Attendance tab is active
  useEffect(() => {
    if (activeTab !== 'Schedule' && activeTab !== 'Attendance') return;
    setLoading(true);
    setError(null);

    // Fetch participants and schedules
    Promise.all([
      fetch(`${API_BASE_URL}/participants`, { credentials: 'include' }),
      fetch(`${API_BASE_URL}/participants/schedules`, { credentials: 'include' })
    ])
      .then(async ([participantsRes, schedulesRes]) => {
        if (!participantsRes.ok) throw new Error('Failed to fetch participants');
        if (!schedulesRes.ok) throw new Error('Failed to fetch schedules');
        const participantsData = await participantsRes.json();
        const schedulesData = await schedulesRes.json();
        setParticipants(participantsData);
        setSchedules(schedulesData);

        // If on Attendance tab, fetch attendance data
        if (activeTab === 'Attendance') {
          const attendanceRes = await fetch(`${API_BASE_URL}/participants/attendance`, { 
            credentials: 'include' 
          });
          if (!attendanceRes.ok) throw new Error('Failed to fetch attendance');
          const attendanceData = await attendanceRes.json();
          setAttendance(attendanceData);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeTab]);

  /**
   * Join participants and schedules for the table, filtered by selected month and year.
   * Ensures all participants are shown, even if they have no schedule for the selected month/year.
   */
  const joinedSchedule = participants.map((p) => {
    const sched = schedules.find((s) =>
      (s.participant_id === p.id || s.id === p.id) &&
      s.month === month &&
      String(s.year) === String(year)
    );
    return {
      id: p.id,
      firstName: p.participant_general_info?.first_name || '',
      lastName: p.participant_general_info?.last_name || '',
      schedule: sched?.schedule || '',
      toileting: sched?.toileting || '',
    };
  });

  /**
   * Filter joined schedule by search string (first or last name).
   */
  const filteredSchedule = joinedSchedule.filter(row =>
    row.firstName.toLowerCase().includes(search.toLowerCase()) ||
    row.lastName.toLowerCase().includes(search.toLowerCase())
  );

  // Attendance tab: join attendance with participants, filter by search and selected month/year
  const filteredAttendance = attendance
    .filter(row => {
      // Filter by selected month and year
      const dateObj = row.date ? new Date(row.date) : null;
      const matchesMonth = dateObj && dateObj.toLocaleString('default', { month: 'long' }) === month;
      const matchesYear = dateObj && dateObj.getFullYear() === Number(year);
      return matchesMonth && matchesYear;
    })
    .map(row => {
      // Join with participant info
      const participant = participants.find(p => p.id === row.participant_id);
      return {
        ...row,
        firstName: participant?.participant_general_info?.first_name || participant?.id || 'Unknown',
        lastName: participant?.participant_general_info?.last_name || '',
      };
    })
    .filter(row =>
      row.firstName.toLowerCase().includes(search.toLowerCase()) ||
      row.lastName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Debugging logs
  console.log('Attendance:', attendance);
  console.log('Participants:', participants);
  console.log('FilteredAttendance:', filteredAttendance);

  /**
   * Open the edit modal for a participant's schedule.
   * @param {object} row - The participant row to edit.
   */
  const handleEdit = (row) => {
    setEditingRow(row);
    // Prepare default schedule state
    const defaultSchedule = {};
    DAYS.forEach(day => {
      if (row.schedule && row.schedule[day]) {
        defaultSchedule[day] = {
          active: row.schedule[day].active,
          time: row.schedule[day].time
        };
      } else {
        defaultSchedule[day] = { active: false, time: 'AM' };
      }
    });
    setEditSchedule(defaultSchedule);
    setEditToileting(row.toileting || 'Remind');
    setModalOpen(true);
  };

  // Handlers for editing modal
  const handleDayCheck = (day) => {
    setEditSchedule(s => ({
      ...s,
      [day]: { ...s[day], active: !s[day].active, time: s[day].active ? 'AM' : s[day].time || 'AM' }
    }));
  };
  const handleTimeChange = (day, time) => {
    setEditSchedule(s => ({
      ...s,
      [day]: { ...s[day], time }
    }));
  };
  const handleToiletingChange = (val) => setEditToileting(val);

  /**
   * Save the edited schedule to the backend.
   * Sends a POST request to upsert the schedule for the selected month and year.
   */
  const handleSave = async () => {
    if (!editingRow) return;
    const payload = {
      month,
      year: Number(year),
      schedule: editSchedule,
      toileting: editToileting
    };
    const url = `${API_BASE_URL}/participants/schedule/${editingRow.id}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      let errMsg = 'Failed to save';
      try {
        const err = await res.json();
        errMsg = err.error || errMsg;
      } catch {}
      alert(errMsg);
      return;
    }
    setModalOpen(false);
    setEditingRow(null);
    // Refresh data
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/participants`, { credentials: 'include' }),
      fetch(`${API_BASE_URL}/participants/schedules`, { credentials: 'include' })
    ])
      .then(async ([participantsRes, schedulesRes]) => {
        const participantsData = await participantsRes.json();
        const schedulesData = await schedulesRes.json();
        setParticipants(participantsData);
        setSchedules(schedulesData);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container>
      <AdminNavBar />
      <Content>
        <Title>Admin Dashboard</Title>
        <SectionTitle>Participant Schedule and Attendance</SectionTitle>
        {/* Filter row for Schedule tab: only month and year */}
        {activeTab === 'Schedule' ? (
          <FilterRow>
            <span style={{ fontWeight: 500 }}>Selected month:</span>
            <Select value={month} onChange={e => setMonth(e.target.value)}>
              <option>March</option>
              <option>April</option>
              <option>May</option>
            </Select>
            <Select value={year} onChange={e => setYear(Number(e.target.value))}>
              <option>2025</option>
              <option>2024</option>
            </Select>
          </FilterRow>
        ) : (
          <FilterRow>
            <span style={{ fontWeight: 500 }}>Selected dates:</span>
            <Select value={month} onChange={e => setMonth(e.target.value)}>
              <option>March</option>
              <option>April</option>
              <option>May</option>
            </Select>
            <Select value={startDay} onChange={e => setStartDay(Number(e.target.value))}>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </Select>
            <span style={{ fontWeight: 500 }}>to</span>
            <Select value={endDay} onChange={e => setEndDay(Number(e.target.value))}>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </Select>
            <Select value={year} onChange={e => setYear(Number(e.target.value))}>
              <option>2025</option>
              <option>2024</option>
            </Select>
            <PrintButton>Print Attendance</PrintButton>
          </FilterRow>
        )}
        <TabSwitcher>
          <Tab active={activeTab === 'Schedule'} onClick={() => setActiveTab('Schedule')}>
            <span role="img" aria-label="calendar">🗓️</span> Schedule
          </Tab>
          <Tab active={activeTab === 'Attendance'} onClick={() => setActiveTab('Attendance')}>
            <span role="img" aria-label="check">✔️</span> Attendance
          </Tab>
        </TabSwitcher>
        <FilterRow>
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
          <Select value={filter} onChange={e => setFilter(e.target.value)}>
            <option>Filter By: None</option>
          </Select>
          <Select value={sort} onChange={e => setSort(e.target.value)}>
            <option>Sort By: Last Name</option>
            <option>Sort By: First Name</option>
          </Select>
        </FilterRow>
        {/* Attendance Table */}
        {activeTab === 'Attendance' && (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>First Name</Th>
                <Th>Last Name</Th>
                <Th>In</Th>
                <Th>Out</Th>
                <Th>Code</Th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length === 0 ? (
                <tr><Td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>No attendance records found for this month/year.</Td></tr>
              ) : (
                filteredAttendance.map((row, idx) => (
                  <tr key={row.id || idx}>
                    <Td>{row.date}</Td>
                    <Td><Pill type={row.time}>{row.time}</Pill></Td>
                    <Td>{row.firstName}</Td>
                    <Td>{row.lastName}</Td>
                    <Td>{row.in}</Td>
                    <Td>{row.out}</Td>
                    <Td>{row.code}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
        {/* Schedule Table */}
        {activeTab === 'Schedule' && (
          <>
            {loading ? (
              <div>Loading schedules...</div>
            ) : error ? (
              <div style={{ color: 'red' }}>Error: {error}</div>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th></Th>
                    <Th>First Name</Th>
                    <Th>Last Name</Th>
                    <Th>Schedule</Th>
                    <Th>Toileting</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedule.map((row, idx) => (
                    <tr key={row.id || idx}>
                      <Td><EditIcon title="Edit" onClick={() => handleEdit(row)}>✏️</EditIcon></Td>
                      <Td>{row.firstName}</Td>
                      <Td>{row.lastName}</Td>
                      <Td>{formatSchedule(row.schedule)}</Td>
                      <Td>{formatToileting(row.toileting)}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            {/* Modal for editing schedule */}
            {modalOpen && (
              <ModalOverlay>
                <ModalContent>
                  <CloseButton onClick={() => { setModalOpen(false); setEditingRow(null); }} title="Close">×</CloseButton>
                  <h2 style={{ marginTop: 0 }}>{editingRow.firstName} {editingRow.lastName} - {month} {year}</h2>
                  <div style={{ fontWeight: 500, marginBottom: 8 }}>Schedule:</div>
                  {DAYS.map(day => (
                    <DayRow key={day}>
                      <Checkbox
                        type="checkbox"
                        checked={editSchedule[day]?.active || false}
                        onChange={() => handleDayCheck(day)}
                        id={`check-${day}`}
                      />
                      <DayLabel htmlFor={`check-${day}`}>{day}:</DayLabel>
                      {TIMES.map(time => (
                        <span key={time} style={{ marginRight: 10 }}>
                          <Radio
                            type="radio"
                            name={`time-${day}`}
                            value={time}
                            checked={editSchedule[day]?.time === time}
                            onChange={() => handleTimeChange(day, time)}
                            disabled={!editSchedule[day]?.active}
                          />
                          <label style={{ color: !editSchedule[day]?.active ? '#aaa' : '#222' }}>{time === 'Full' ? 'Full-Day' : time}</label>
                        </span>
                      ))}
                    </DayRow>
                  ))}
                  <ToiletingRow>
                    <div style={{ fontWeight: 500, marginBottom: 8 }}>Toileting:</div>
                    {TOILETING.map(val => (
                      <span key={val} style={{ marginRight: 18 }}>
                        <Radio
                          type="radio"
                          name="toileting"
                          value={val}
                          checked={editToileting === val}
                          onChange={() => handleToiletingChange(val)}
                        />
                        <label>{val}</label>
                      </span>
                    ))}
                  </ToiletingRow>
                  <SaveButton onClick={handleSave}>Save</SaveButton>
                </ModalContent>
              </ModalOverlay>
            )}
          </>
        )}
      </Content>
    </Container>
  );
}
