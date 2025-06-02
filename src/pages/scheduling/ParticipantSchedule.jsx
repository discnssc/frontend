import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { exportAttendanceReport } from 'utils/excelExport';

import { Button } from 'common/components/Button';
import AdminNavBar from 'common/components/navigation/AdminNavBar';
import MenuDrawer from 'common/components/navigation/MenuDrawer';

// API base URL from environment
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const Container = styled.div`
  background: #f2f2f2;
  min-height: 100vh;
  padding-bottom: 6%;
  padding-top: 6%;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
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

const SearchContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex: 1;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-left: auto;
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
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: ${(props) => {
    if (props.type === 'date') return '80px';
    if (props.type === 'month') return '140px';
    if (props.type === 'year') return '100px';
    return '140px';
  }};

  &:hover {
    border-color: rgb(0, 86, 150);
  }

  &:focus {
    outline: none;
    border-color: rgb(0, 86, 150);
    box-shadow: 0 0 0 2px rgba(0, 86, 150, 0.1);
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const DateRangeLabel = styled.span`
  font-weight: 500;
  white-space: nowrap;
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
  border-bottom: ${({ active }) =>
    active ? '4px solid rgb(0, 86, 150)' : '4px solid transparent'};
  display: flex;
  align-items: center;
  cursor: pointer;
  transition:
    color 0.2s,
    border-bottom 0.2s;
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
  return DAYS.filter((day) => schedule[day] && schedule[day].active)
    .map((day) => {
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

// Format a time string (HH:mm or HH:mm:ss) to 12-hour format with AM/PM.
function formatTime12Hour(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  let hour = parseInt(h, 10);
  const minute = m;
  if (isNaN(hour) || minute === undefined) return timeStr;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
  return `${hourStr}:${minute} ${ampm}`;
}

/**
 * Main component for the Participant Schedule and Attendance page.
 * Handles fetching, displaying, and editing participant schedules.
 */
export default function ParticipantSchedule() {
  // Get current date info
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const daysInCurrentMonth = new Date(
    currentYear,
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Get all months
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Get days in month
  const getDaysInMonth = (month, year) => {
    return new Date(year, months.indexOf(month) + 1, 0).getDate();
  };

  // Helper function to check if a date is within range
  const isDateInRange = (dateStr) => {
    // Parse dateStr as local date
    const [yyyy, mm, dd] = dateStr.split('-').map(Number);
    const date = new Date(yyyy, mm - 1, dd);

    const startDate = new Date(startYear, months.indexOf(startMonth), startDay);
    const endDate = new Date(endYear, months.indexOf(endMonth), endDay);

    // Zero out the time for all dates
    date.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    return date >= startDate && date <= endDate;
  };

  // UI state
  const [activeTab, setActiveTab] = useState('Attendance');
  const [month, setMonth] = useState(currentMonth);
  const [startMonth, setStartMonth] = useState(currentMonth);
  const [endMonth, setEndMonth] = useState(currentMonth);
  const [startDay, setStartDay] = useState(1);
  const [endDay, setEndDay] = useState(daysInCurrentMonth);
  const [year, setYear] = useState(currentYear);
  const [startYear, setStartYear] = useState(currentYear);
  const [endYear, setEndYear] = useState(currentYear);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('None');
  const [sort, setSort] = useState('Sort By: Date');

  // Data state
  const [participants, setParticipants] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableAttendanceYears, setAvailableAttendanceYears] = useState([]);
  const [attendance, setAttendance] = useState([]);

  // Modal state for editing
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editSchedule, setEditSchedule] = useState({});
  const [editToileting, setEditToileting] = useState('Remind');

  // Update sort when tab changes
  useEffect(() => {
    setSort(activeTab === 'Schedule' ? 'Sort By: Last Name' : 'Sort By: Date');
  }, [activeTab]);

  // Sort functions
  const sortSchedule = (data) => {
    switch (sort) {
      case 'Sort By: Last Name':
        return [...data].sort((a, b) => a.lastName.localeCompare(b.lastName));
      case 'Sort By: First Name':
        return [...data].sort((a, b) => a.firstName.localeCompare(b.firstName));
      default:
        return data;
    }
  };

  const sortAttendance = (data) => {
    switch (sort) {
      case 'Sort By: Date':
        return [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'Sort By: Last Name':
        return [...data].sort((a, b) => a.lastName.localeCompare(b.lastName));
      case 'Sort By: First Name':
        return [...data].sort((a, b) => a.firstName.localeCompare(b.firstName));
      default:
        return data;
    }
  };

  // Process and sort attendance data
  const processAttendanceData = (data) => {
    return sortAttendance(
      data
        .filter((row) => row.date && isDateInRange(row.date))
        .map((row) => {
          const participant = participants.find(
            (p) => p.id === row.participant_id
          );
          return {
            ...row,
            firstName:
              participant?.participant_general_info?.first_name ||
              participant?.id ||
              'Unknown',
            lastName: participant?.participant_general_info?.last_name || '',
          };
        })
        .filter(
          (row) =>
            row.firstName.toLowerCase().includes(search.toLowerCase()) ||
            row.lastName.toLowerCase().includes(search.toLowerCase())
        )
    );
  };

  // Process and sort schedule data
  const processScheduleData = (data) => {
    return sortSchedule(
      data.filter(
        (row) =>
          row.firstName.toLowerCase().includes(search.toLowerCase()) ||
          row.lastName.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  // Fetch participants, schedules, and attendance on mount or when Schedule/Attendance tab is active
  useEffect(() => {
    if (activeTab !== 'Schedule' && activeTab !== 'Attendance') return;
    setLoading(true);
    setError(null);

    // Fetch participants and schedules
    Promise.all([
      fetch(`${API_BASE_URL}/participants`, { credentials: 'include' }),
      fetch(`${API_BASE_URL}/schedule/schedules`, { credentials: 'include' }),
    ])
      .then(async ([participantsRes, schedulesRes]) => {
        if (!participantsRes.ok)
          throw new Error('Failed to fetch participants');
        if (!schedulesRes.ok) throw new Error('Failed to fetch schedules');
        const participantsData = await participantsRes.json();
        const schedulesData = await schedulesRes.json();
        setParticipants(participantsData);
        setSchedules(schedulesData);

        // Extract unique years from schedules for Schedule tab
        const years = [...new Set(schedulesData.map((s) => s.year))];
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        const uniqueYears = [
          ...new Set([...years, currentYear, nextYear]),
        ].sort((a, b) => b - a);
        setAvailableYears(uniqueYears);

        // If on Attendance tab, fetch attendance data
        if (activeTab === 'Attendance') {
          const attendanceRes = await fetch(
            `${API_BASE_URL}/schedule/attendance`,
            {
              credentials: 'include',
            }
          );
          if (!attendanceRes.ok) throw new Error('Failed to fetch attendance');
          const attendanceData = await attendanceRes.json();
          setAttendance(attendanceData);

          // Extract unique years from attendance data
          const attendanceYears = [
            ...new Set(
              attendanceData.map((a) => new Date(a.date).getFullYear())
            ),
          ];
          const uniqueAttendanceYears = [
            ...new Set([...attendanceYears, currentYear, nextYear]),
          ].sort((a, b) => b - a);
          setAvailableAttendanceYears(uniqueAttendanceYears);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeTab]);

  // Join participants and schedules for the table
  const joinedSchedule = participants.map((p) => {
    const sched = schedules.find(
      (s) =>
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

  // Get filtered and sorted data
  const filteredSchedule = processScheduleData(joinedSchedule);
  const filteredAttendance = processAttendanceData(attendance);

  /**
   * Open the edit modal for a participant's schedule.
   * @param {object} row - The participant row to edit.
   */
  const handleEdit = (row) => {
    setEditingRow(row);
    // Prepare default schedule state
    const defaultSchedule = {};
    DAYS.forEach((day) => {
      if (row.schedule && row.schedule[day]) {
        defaultSchedule[day] = {
          active: row.schedule[day].active,
          time: row.schedule[day].time,
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
    setEditSchedule((s) => ({
      ...s,
      [day]: {
        ...s[day],
        active: !s[day].active,
        time: s[day].active ? 'AM' : s[day].time || 'AM',
      },
    }));
  };
  const handleTimeChange = (day, time) => {
    setEditSchedule((s) => ({
      ...s,
      [day]: { ...s[day], time },
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
      toileting: editToileting,
    };
    const url = `${API_BASE_URL}/schedule/schedule/${editingRow.id}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      let errMsg = 'Failed to save';
      try {
        const err = await res.json();
        errMsg = err.error || errMsg;
      } catch (e) {
        console.error(e);
      }
      alert(errMsg);
      return;
    }
    setModalOpen(false);
    setEditingRow(null);
    // Refresh data
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/participants`, { credentials: 'include' }),
      fetch(`${API_BASE_URL}/schedule/schedules`, { credentials: 'include' }),
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
      <MenuDrawer />
      <Content>
        <Title>Admin Dashboard</Title>
        <AdminNavBar />
        <SectionTitle>Participant Schedule and Attendance</SectionTitle>

        {/* Filter row for Schedule tab */}
        {activeTab === 'Schedule' && (
          <FilterRow>
            <DateRangeLabel>Selected month:</DateRangeLabel>
            <SelectWrapper>
              <Select
                type='month'
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
            </SelectWrapper>
            <SelectWrapper>
              <Select
                type='year'
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Select>
            </SelectWrapper>
          </FilterRow>
        )}

        {/* Filter row for Attendance tab */}
        {activeTab === 'Attendance' && (
          <FilterRow>
            <DateRangeContainer>
              <DateRangeLabel>Date range:</DateRangeLabel>
              <SelectWrapper>
                <Select
                  type='month'
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </Select>
              </SelectWrapper>
              <SelectWrapper>
                <Select
                  type='date'
                  value={startDay}
                  onChange={(e) => setStartDay(Number(e.target.value))}
                >
                  {[...Array(getDaysInMonth(startMonth, startYear))].map(
                    (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    )
                  )}
                </Select>
              </SelectWrapper>
              <SelectWrapper>
                <Select
                  type='year'
                  value={startYear}
                  onChange={(e) => setStartYear(Number(e.target.value))}
                >
                  {availableAttendanceYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Select>
              </SelectWrapper>
              <DateRangeLabel>to</DateRangeLabel>
              <SelectWrapper>
                <Select
                  type='month'
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </Select>
              </SelectWrapper>
              <SelectWrapper>
                <Select
                  type='date'
                  value={endDay}
                  onChange={(e) => setEndDay(Number(e.target.value))}
                >
                  {[...Array(getDaysInMonth(endMonth, endYear))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </Select>
              </SelectWrapper>
              <SelectWrapper>
                <Select
                  type='year'
                  value={endYear}
                  onChange={(e) => setEndYear(Number(e.target.value))}
                >
                  {availableAttendanceYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Select>
              </SelectWrapper>
            </DateRangeContainer>
            <PrintButton
              onClick={() => {
                // Build filename based on selected date range
                const start = `${startMonth}_${startDay}_${startYear}`;
                const end = `${endMonth}_${endDay}_${endYear}`;
                const filename = `Attendance_${start}_to_${end}.xlsx`;
                exportAttendanceReport(filteredAttendance, filename);
              }}
              style={{ color: 'white' }}
            >
              Export Attendance
            </PrintButton>
          </FilterRow>
        )}
        <TabSwitcher>
          <Tab
            active={activeTab === 'Schedule'}
            onClick={() => setActiveTab('Schedule')}
          >
            <span role='img' aria-label='calendar'>
              🗓️
            </span>{' '}
            Schedule
          </Tab>
          <Tab
            active={activeTab === 'Attendance'}
            onClick={() => setActiveTab('Attendance')}
          >
            <span role='img' aria-label='check'>
              ✔️
            </span>{' '}
            Attendance
          </Tab>
        </TabSwitcher>
        <FilterRow>
          <SearchContainer>
            <Input
              placeholder='Search...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 220 }}
            />
          </SearchContainer>
          <FilterContainer>
            <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>Filter By: None</option>
            </Select>
            <Select value={sort} onChange={(e) => setSort(e.target.value)}>
              {activeTab === 'Schedule' ? (
                <>
                  <option value='Sort By: Last Name'>Sort By: Last Name</option>
                  <option value='Sort By: First Name'>
                    Sort By: First Name
                  </option>
                </>
              ) : (
                <>
                  <option value='Sort By: Date'>Sort By: Date</option>
                  <option value='Sort By: Last Name'>Sort By: Last Name</option>
                  <option value='Sort By: First Name'>
                    Sort By: First Name
                  </option>
                </>
              )}
            </Select>
          </FilterContainer>
        </FilterRow>
        {/* Attendance Table */}
        {activeTab === 'Attendance' && (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>First Name</Th>
                <Th>Last Name</Th>
                <Th>In</Th>
                <Th>Out</Th>
                <Th>Code</Th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length === 0 ? (
                <tr>
                  <Td
                    colSpan={6}
                    style={{ textAlign: 'center', color: '#888' }}
                  >
                    No attendance records found for this month/year.
                  </Td>
                </tr>
              ) : (
                filteredAttendance.map((row, idx) => (
                  <tr key={row.id || idx}>
                    <Td>{row.date}</Td>
                    <Td>{row.firstName}</Td>
                    <Td>{row.lastName}</Td>
                    <Td>{formatTime12Hour(row.in)}</Td>
                    <Td>{formatTime12Hour(row.out)}</Td>
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
                      <Td>
                        <EditIcon title='Edit' onClick={() => handleEdit(row)}>
                          ✏️
                        </EditIcon>
                      </Td>
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
                  <CloseButton
                    onClick={() => {
                      setModalOpen(false);
                      setEditingRow(null);
                    }}
                    title='Close'
                  >
                    ×
                  </CloseButton>
                  <h2 style={{ marginTop: 0 }}>
                    {editingRow.firstName} {editingRow.lastName} - {month}{' '}
                    {year}
                  </h2>
                  <div style={{ fontWeight: 500, marginBottom: 8 }}>
                    Schedule:
                  </div>
                  {DAYS.map((day) => (
                    <DayRow key={day}>
                      <Checkbox
                        type='checkbox'
                        checked={editSchedule[day]?.active || false}
                        onChange={() => handleDayCheck(day)}
                        id={`check-${day}`}
                      />
                      <DayLabel htmlFor={`check-${day}`}>{day}:</DayLabel>
                      {TIMES.map((time) => (
                        <span key={time} style={{ marginRight: 10 }}>
                          <Radio
                            type='radio'
                            name={`time-${day}`}
                            value={time}
                            checked={editSchedule[day]?.time === time}
                            onChange={() => handleTimeChange(day, time)}
                            disabled={!editSchedule[day]?.active}
                          />
                          <label
                            style={{
                              color: !editSchedule[day]?.active
                                ? '#aaa'
                                : '#222',
                            }}
                          >
                            {time === 'Full' ? 'Full-Day' : time}
                          </label>
                        </span>
                      ))}
                    </DayRow>
                  ))}
                  <ToiletingRow>
                    <div style={{ fontWeight: 500, marginBottom: 8 }}>
                      Toileting:
                    </div>
                    {TOILETING.map((val) => (
                      <span key={val} style={{ marginRight: 18 }}>
                        <Radio
                          type='radio'
                          name='toileting'
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
