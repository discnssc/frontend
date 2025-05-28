import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const generateMonthlyActivityParticipationReport = (
  activities,
  participantName,
  year,
  month
) => {
  const filename = `${participantName} ${month}_${year} Activity Participation Report.xlsx`;
  const monthIndex =
    typeof month === 'string' ? parseInt(month, 10) - 1 : month;
  const yearIndex = typeof year === 'string' ? parseInt(year, 10) : year;
  const daysInMonth = daysInAMonth(yearIndex, monthIndex);
  const dateHeaders = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const titleRow = [
    'Activity Chart',
    participantName,
    `${monthName(monthIndex)} ${year}`,
  ];
  const headerRow = ['date', ...dateHeaders, 'tot #', 'avg'];

  // Group activity ratings by activity name and day
  const activityMap = {};
  activities.forEach(({ schedule, date, rating, declined }) => {
    const { name: activity } = schedule;
    const activityDate = new Date(date);
    if (
      activityDate.getMonth() === monthIndex &&
      activityDate.getFullYear() === yearIndex &&
      !declined &&
      rating != null
    ) {
      const day = activityDate.getDate();
      if (!activityMap[activity]) activityMap[activity] = {};
      activityMap[activity][day] = rating;
    }
  });

  const rows = [titleRow, headerRow];

  Object.entries(activityMap).forEach(([activityName, ratingsByDay]) => {
    const row = [activityName];
    let total = 0;
    let count = 0;

    dateHeaders.forEach((day) => {
      const rating = ratingsByDay[day];
      if (rating != null) {
        row.push(rating);
        total += rating;
        count++;
      } else {
        row.push('');
      }
    });

    row.push(count);
    row.push(count > 0 ? +(total / count).toFixed(2) : '');
    rows.push(row);
  });

  // Create worksheet and export
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet['!cols'] = [{ wch: 15 }, { wch: 15 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Monthly Report');

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveAs(blob, filename);
};

function monthName(index) {
  return new Date(2000, index).toLocaleString('default', { month: 'short' });
}

function daysInAMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
}

export const generateAggregateActivityReport = (
  activities,
  participantName,
  startMonth,
  startYear,
  endMonth,
  endYear
) => {
  const filename = `${participantName} Aggregate Report ${startMonth}_${startYear} - ${endMonth}_${endYear}.xlsx`;
  const startDate = new Date(parseInt(startYear), parseInt(startMonth) - 1, 1);
  const endDate = new Date(parseInt(endYear), parseInt(endMonth), 0);

  const titleRow = [
    'Activity Chart',
    participantName,
    `Dates: ${formatDate(startDate)} to ${formatDate(endDate)}`,
  ];
  const headerRow = [
    'Activity',
    'Total # engaged in',
    '% Activities offered',
    'Average score',
  ];

  const activityMap = {};
  const totalOffered = {};
  activities.forEach(({ schedule, date, rating, declined }) => {
    const { name: activity } = schedule;
    const activityDate = new Date(date);
    if (activityDate >= startDate && activityDate <= endDate) {
      if (!totalOffered[activity]) totalOffered[activity] = 0;
      totalOffered[activity]++;
      if (!declined && rating != null) {
        if (!activityMap[activity]) activityMap[activity] = [];
        activityMap[activity].push(rating);
      }
    }
  });

  const rows = [titleRow, headerRow];

  Object.entries(totalOffered).forEach(([activityName, totalOfferedCount]) => {
    const ratings = activityMap[activityName] || [];
    const totalEngaged = ratings.length;
    const averageScore =
      totalEngaged > 0
        ? +(ratings.reduce((sum, r) => sum + r, 0) / totalEngaged).toFixed(2)
        : '';
    const percentOffered = `${((totalEngaged / totalOfferedCount) * 100).toFixed(0)}`;

    rows.push([activityName, totalEngaged, percentOffered, averageScore]);
  });

  // Create worksheet and export
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet['!cols'] = [{ wch: 15 }, { wch: 17 }, { wch: 18 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Aggregate Report');

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveAs(blob, filename);
};

/**
 * Format a time string (HH:mm or HH:mm:ss) to 12-hour format with AM/PM, always two digits for hour.
 * @param {string} timeStr
 * @returns {string}
 */
function formatTime12Hour(timeStr) {
  if (!timeStr) return '';
  // Accepts 'HH:mm' or 'HH:mm:ss'
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
 * Export attendance records to an Excel file.
 * @param {Array} attendanceRows - Array of attendance records with fields: date, firstName, lastName, in, out, code
 * @param {string} filename - Name of the file to save
 */
export function exportAttendanceReport(
  attendanceRows,
  filename = 'Attendance_Report.xlsx'
) {
  const header = ['Date', 'First Name', 'Last Name', 'In', 'Out', 'Code'];
  const rows = [header];
  attendanceRows.forEach((row) => {
    rows.push([
      row.date || '',
      row.firstName || '',
      row.lastName || '',
      formatTime12Hour(row.in),
      formatTime12Hour(row.out),
      row.code || '',
    ]);
  });
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet['!cols'] = [
    { wch: 12 }, // Date
    { wch: 16 }, // First Name
    { wch: 16 }, // Last Name
    { wch: 10 }, // In
    { wch: 10 }, // Out
    { wch: 8 }, // Code
  ];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, filename);
}
