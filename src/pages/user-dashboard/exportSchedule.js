import * as XLSX from 'xlsx';

/**
 * Exports the schedule to an Excel file with AM, PM, and Full columns, each with subcolumns.
 * @param {Array} am - Array of AM session participants
 * @param {Array} pm - Array of PM session participants
 * @param {Array} full - Array of Full session participants
 */
export function exportScheduleToExcel(am, pm, full) {
  // Helper to format a row for a session
  const formatRow = (p) => [
    p.name || '',
    p.toileting || '',
    p.in || '',
    p.out || '',
    p.code || '',
  ];

  // Find the max number of rows among the sessions
  const maxRows = Math.max(am.length, pm.length, full.length);

  // Build the header row
  const header = [
    'AM',
    '',
    '',
    '',
    '',
    'PM',
    '',
    '',
    '',
    '',
    'Full',
    '',
    '',
    '',
    '',
  ];
  const subHeader = [
    'Name',
    'R/A',
    'In',
    'Out',
    'Code',
    'Name',
    'R/A',
    'In',
    'Out',
    'Code',
    'Name',
    'R/A',
    'In',
    'Out',
    'Code',
  ];

  // Build the data rows
  const rows = [];
  for (let i = 0; i < maxRows; i++) {
    rows.push([
      ...(am[i] ? formatRow(am[i]) : ['', '', '', '', '']),
      ...(pm[i] ? formatRow(pm[i]) : ['', '', '', '', '']),
      ...(full[i] ? formatRow(full[i]) : ['', '', '', '', '']),
    ]);
  }

  // Combine all rows
  const data = [header, subHeader, ...rows];

  // Create worksheet and workbook
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Schedule');

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const filename = `schedule-${yyyy}-${mm}-${dd}.xlsx`;

  // Export to file
  XLSX.writeFile(wb, filename);
}
