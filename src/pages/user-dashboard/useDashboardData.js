import { useCallback, useEffect, useState } from 'react';

import { getMostRecentToileting, getTodayDateString } from './dashboardUtils';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Custom hook for managing dashboard data and logic.
 * Periodically refreshes data and always uses the current date for filtering.
 * @returns {Object} Dashboard state and handlers
 */
export function useDashboardData() {
  const [participants, setParticipants] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalSessionKey, setModalSessionKey] = useState('');
  const [search, setSearch] = useState('');

  // Fetch data function
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

  // Initial and periodic data fetch
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // every 5 minutes
    return () => clearInterval(interval);
  }, [fetchData]);

  /**
   * Get all participants (scheduled and unscheduled) for a session.
   * @param {string} sessionKey
   * @returns {Array}
   */
  const getSessionParticipants = useCallback(
    (sessionKey) => {
      const todayDateStr = getTodayDateString();
      const today = new Date();
      const todayDay = today.toLocaleString('default', { weekday: 'long' });
      const todayMonth = today.toLocaleString('default', { month: 'long' });
      const todayYear = today.getFullYear();
      // filter schedules for the current day, session type, and current month/year
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
      // find the relevant row info for the scheduled participants
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
      // Unscheduled participants with attendance for today
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

  /**
   * Save handler for a row.
   * @param {Object} row
   */
  const handleSaveRow = useCallback(async (row) => {
    const todayDateStr = getTodayDateString();
    const payload = {
      id: row.attendanceId,
      participant_id: row.participant_id,
      date: todayDateStr,
      in: row.in,
      out: row.out,
      code: row.code,
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

  /**
   * Handler for Add Unscheduled Participant.
   * @param {string} sessionKey
   */
  const handleAddUnscheduled = useCallback((sessionKey) => {
    setModalSessionKey(sessionKey);
    setShowModal(true);
    setSearch('');
  }, []);

  /**
   * Handler for selecting a participant in the modal.
   * @param {Object} participant
   */
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

  /**
   * Get available participants for the modal search.
   * @returns {Array}
   */
  const getAvailableParticipants = useCallback(() => {
    const todayDateStr = getTodayDateString();
    const today = new Date();
    const todayDay = today.toLocaleString('default', { weekday: 'long' });
    // Get all scheduled participant ids for this session
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
    // Also exclude those already in attendance for today
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
    participants,
    schedules,
    attendance,
    loading,
    error,
    showModal,
    modalSessionKey,
    search,
    setShowModal,
    setModalSessionKey,
    setSearch,
    getSessionParticipants,
    handleSaveRow,
    handleAddUnscheduled,
    handleSelectParticipant,
    getAvailableParticipants,
  };
}
