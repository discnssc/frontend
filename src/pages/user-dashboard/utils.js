import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * Session types for the dashboard tables.
 */
export const SESSION_TYPES = [
  { key: 'AM', label: 'AM Attendance' },
  { key: 'PM', label: 'PM Attendance' },
  { key: 'Full', label: 'Full-Day Attendance' },
];

export const MONTH_ORDER = [
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

export function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function getMostRecentToileting(participant_id, schedules) {
  const userSchedules = schedules.filter(
    (s) => s.participant_id === participant_id
  );
  if (userSchedules.length === 0) return '';

  userSchedules.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return MONTH_ORDER.indexOf(b.month) - MONTH_ORDER.indexOf(a.month);
  });
  return userSchedules[0]?.toileting || '';
}

function format12Hour(timeStr) {
  if (!timeStr) return '';
  const [hourStr, minuteStr] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr.padStart(2, '0');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

export async function exportScheduleToExcel(am, pm, full) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Schedule');

  // Merge and label section headers
  worksheet.mergeCells('A1:E1');
  worksheet.mergeCells('F1:J1');
  worksheet.mergeCells('K1:O1');
  worksheet.getRow(1).height = 24;

  worksheet.getCell('A1').value = 'AM';
  worksheet.getCell('F1').value = 'PM';
  worksheet.getCell('K1').value = 'Full';

  ['A1', 'F1', 'K1'].forEach((cell) => {
    const c = worksheet.getCell(cell);
    c.alignment = { horizontal: 'center', vertical: 'middle' };
    c.font = { bold: true, size: 14 };
    c.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // Subheaders
  const subHeaders = ['Name', 'R/A', 'In', 'Out', 'Code'];
  worksheet.addRow([...subHeaders, ...subHeaders, ...subHeaders]);
  const row2 = worksheet.getRow(2);
  row2.height = 20;
  row2.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  const formatRow = (p) => [
    p.name || '',
    p.toileting || '',
    format12Hour(p.in),
    format12Hour(p.out),
    p.code || '',
  ];

  const maxRows = Math.max(am.length, pm.length, full.length);
  for (let i = 0; i < maxRows; i++) {
    const row = [
      ...(am[i] ? formatRow(am[i]) : ['', '', '', '', '']),
      ...(pm[i] ? formatRow(pm[i]) : ['', '', '', '', '']),
      ...(full[i] ? formatRow(full[i]) : ['', '', '', '', '']),
    ];
    worksheet.addRow(row);
  }

  // Styling for data rows and column sizes
  worksheet.columns.forEach((col) => {
    col.width = 16;
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 2) {
      row.height = 18;
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { size: 11 };
      });
    }
  });

  // Save to file
  const blob = await workbook.xlsx.writeBuffer();
  const today = new Date();
  const filename = `schedule-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}.xlsx`;
  saveAs(new Blob([blob]), filename);
}
