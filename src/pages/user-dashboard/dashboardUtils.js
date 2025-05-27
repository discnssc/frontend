/**
 * Get today's date in YYYY-MM-DD format.
 * @returns {string}
 */
export function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Get the most recent toileting value for a participant from their schedules.
 * @param {string} participant_id
 * @param {Array} schedules
 * @returns {string}
 */
export function getMostRecentToileting(participant_id, schedules) {
  // Find all schedules for this participant
  const userSchedules = schedules.filter(
    (s) => s.participant_id === participant_id
  );
  if (userSchedules.length === 0) return '';
  // Sort by year, then by month (assuming month is full name, e.g., 'January')
  const monthOrder = [
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
  userSchedules.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
  });
  return userSchedules[0]?.toileting || '';
}
