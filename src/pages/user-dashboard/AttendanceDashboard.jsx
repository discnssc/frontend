/*
  This component is used to display the attendance dashboard for the user.

  It displays who is expected to come in today and offers the ability to add unscheduled participants.
  It also allows you to log when participants come in and out, and add codes to their attendance.
*/
import React, { useCallback, useEffect, useState } from 'react';

import MenuDrawer from 'common/components/navigation/MenuDrawer';

import {
  BottomSpacer,
  ContentWrapper,
  DashboardContainer,
  ExportButton,
  HeaderRow,
  ScheduleTitle,
  WelcomeTitle,
} from './AttendanceDashboard.styles';
import AttendanceTable, { AddUnscheduledModal } from './AttendanceTable';
import {
  SESSION_TYPES,
  exportScheduleToExcel,
  getMostRecentToileting,
  getTodayDateString,
} from './utils';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

function useDashboardData() {
  const [participants, setParticipants] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalSessionKey, setModalSessionKey] = useState('');
  const [search, setSearch] = useState('');

  // Fetch the data from the server to populate the dashboard
  const fetchData = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/participants`, { credentials: 'include' }),
      fetch(`${API_BASE_URL}/schedule/schedules`, { credentials: 'include' }),
      fetch(`${API_BASE_URL}/schedule/attendance`, { credentials: 'include' }),
    ])
      .then(async ([pRes, sRes, aRes]) => {
        if (!pRes.ok || !sRes.ok || !aRes.ok)
          throw new Error('Failed to fetch data');
        const [participantsData, schedulesData, attendanceData] =
          await Promise.all([pRes.json(), sRes.json(), aRes.json()]);
        setParticipants(participantsData);
        setSchedules(schedulesData);
        setAttendance(attendanceData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // call fetchData every 5 minutes after the component mounts
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Get the participants for a given session (AM, PM, Full)
  const getSessionParticipants = useCallback(
    (sessionKey) => {
      const todayDateStr = getTodayDateString();
      const today = new Date();
      const todayDay = today.toLocaleString('default', { weekday: 'long' });
      const todayMonth = today.toLocaleString('default', { month: 'long' });
      const todayYear = today.getFullYear();
      const filteredSchedules = schedules.filter(
        (s) =>
          s.month === todayMonth &&
          String(s.year) === String(todayYear) &&
          s.schedule &&
          s.schedule[todayDay] &&
          s.schedule[todayDay].active === true &&
          ((sessionKey === 'Full' && s.schedule[todayDay].time === 'Full') ||
            (sessionKey === 'AM' && s.schedule[todayDay].time === 'AM') ||
            (sessionKey === 'PM' && s.schedule[todayDay].time === 'PM'))
      );
      const scheduledRows = filteredSchedules.map((sched) => {
        const participant = participants.find(
          (p) => p.id === sched.participant_id
        );
        const att = attendance.find(
          (a) =>
            a.participant_id === sched.participant_id && a.date === todayDateStr
        );
        return {
          id: att?.id || `${sched.participant_id}-${sessionKey}`,
          participant_id: sched.participant_id,
          name: `${participant?.participant_general_info?.first_name || ''} ${participant?.participant_general_info?.last_name || ''}`.trim(),
          toileting: sched.toileting || '',
          in: att?.in || '',
          out: att?.out || '',
          code: att?.code || '',
          attendanceId: att?.id,
        };
      });
      const scheduledIds = new Set(
        scheduledRows.map((row) => row.participant_id)
      );
      const unscheduledAtts = attendance.filter(
        (a) =>
          a.date === todayDateStr &&
          !scheduledIds.has(a.participant_id) &&
          a.session === sessionKey
      );
      const unscheduledRows = unscheduledAtts.map((att) => {
        const participant = participants.find(
          (p) => p.id === att.participant_id
        );
        return {
          id: att.id,
          participant_id: att.participant_id,
          name: `${participant?.participant_general_info?.first_name || ''} ${participant?.participant_general_info?.last_name || ''}`.trim(),
          toileting: getMostRecentToileting(att.participant_id, schedules),
          in: att.in || '',
          out: att.out || '',
          code: att.code || '',
          attendanceId: att.id,
        };
      });
      return [...scheduledRows, ...unscheduledRows];
    },
    [attendance, participants, schedules]
  );

  // Save the attendance for a given row
  const handleSaveRow = useCallback(async (row) => {
    const todayDateStr = getTodayDateString();
    const payload = {
      id: row.attendanceId,
      participant_id: row.participant_id,
      date: todayDateStr,
      in: row.in || null,
      out: row.out || null,
      code: row.code || null,
    };
    try {
      const res = await fetch(`${API_BASE_URL}/schedule/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setAttendance((prev) => {
          const idx = prev.findIndex((a) => a.id === row.attendanceId);
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], ...payload };
            return updated;
          } else {
            return [...prev, { ...payload }];
          }
        });
      } else {
        throw new Error('Failed to save attendance');
      }
    } catch (err) {
      alert(err.message);
    }
  }, []);

  // Open the modal to add an unscheduled participant
  const handleAddUnscheduled = useCallback((sessionKey) => {
    setModalSessionKey(sessionKey);
    setShowModal(true);
    setSearch('');
  }, []);

  // Add an unscheduled participant to the attendance
  const handleSelectParticipant = useCallback(
    async (participant) => {
      const todayDateStr = getTodayDateString();
      const payload = {
        participant_id: participant.id,
        date: todayDateStr,
        session: modalSessionKey,
      };
      try {
        const res = await fetch(`${API_BASE_URL}/schedule/attendance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const newRecord = await res.json();
          setAttendance((prev) => [...prev, newRecord]);
          setShowModal(false);
        } else {
          throw new Error('Failed to add unscheduled participant');
        }
      } catch (err) {
        alert(err.message);
      }
    },
    [modalSessionKey]
  );

  // Get participants who are not scheduled for the given session and have not attended today
  const getAvailableParticipants = useCallback(() => {
    const todayDateStr = getTodayDateString();
    const today = new Date();
    const todayDay = today.toLocaleString('default', { weekday: 'long' });
    const scheduledIds = schedules
      .filter(
        (s) =>
          s.month === today.toLocaleString('default', { month: 'long' }) &&
          String(s.year) === String(today.getFullYear()) &&
          s.schedule &&
          s.schedule[todayDay] &&
          s.schedule[todayDay].active === true &&
          ((modalSessionKey === 'Full' &&
            s.schedule[todayDay].time === 'Full') ||
            (modalSessionKey === 'AM' && s.schedule[todayDay].time === 'AM') ||
            (modalSessionKey === 'PM' && s.schedule[todayDay].time === 'PM'))
      )
      .map((s) => s.participant_id);
    const attendedIds = attendance
      .filter((a) => a.date === todayDateStr)
      .map((a) => a.participant_id);
    return participants.filter(
      (p) =>
        !scheduledIds.includes(p.id) &&
        !attendedIds.includes(p.id) &&
        `${p.participant_general_info?.first_name || ''} ${p.participant_general_info?.last_name || ''}`
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [attendance, modalSessionKey, participants, schedules, search]);

  return {
    loading,
    error,
    showModal,
    search,
    setShowModal,
    setSearch,
    getSessionParticipants,
    handleSaveRow,
    handleAddUnscheduled,
    handleSelectParticipant,
    getAvailableParticipants,
  };
}

/* ========================================= Main Component Display ========================================= */

function AttendanceDashboard() {
  const {
    loading,
    error,
    showModal,
    search,
    setShowModal,
    setSearch,
    getSessionParticipants,
    handleSaveRow,
    handleAddUnscheduled,
    handleSelectParticipant,
    getAvailableParticipants,
  } = useDashboardData();

  const handleExport = () => {
    const am = getSessionParticipants('AM');
    const pm = getSessionParticipants('PM');
    const full = getSessionParticipants('Full');
    exportScheduleToExcel(am, pm, full);
  };

  return (
    <DashboardContainer>
      <MenuDrawer />
      <ContentWrapper>
        <WelcomeTitle>Welcome Back!</WelcomeTitle>
        <HeaderRow>
          <ScheduleTitle>Today&apos;s Participant Schedule</ScheduleTitle>
          <ExportButton onClick={handleExport}>Export Schedule</ExportButton>
        </HeaderRow>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>Error: {error}</div>
        ) : (
          SESSION_TYPES.map((session) => (
            <AttendanceTable
              key={session.key}
              title={session.label}
              data={getSessionParticipants(session.key)}
              onAddUnscheduled={() => handleAddUnscheduled(session.key)}
              onSaveRow={handleSaveRow}
            />
          ))
        )}
        <BottomSpacer />
      </ContentWrapper>
      {showModal && (
        <AddUnscheduledModal
          search={search}
          setSearch={setSearch}
          getAvailableParticipants={getAvailableParticipants}
          handleSelectParticipant={handleSelectParticipant}
          setShowModal={setShowModal}
        />
      )}
    </DashboardContainer>
  );
}

export default AttendanceDashboard;
