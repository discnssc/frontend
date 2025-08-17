import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  generateAggregateActivityReport,
  generateMonthlyActivityParticipationReport,
} from 'utils/excelExport.js';

import Header from 'common/components/Header';
import ParticipantNavbar from 'common/components/ParticipantNavBar';
import MonthYearDropdown from 'common/components/activities/MonthYearDropdown';
import MenuDrawer from 'common/components/navigation/MenuDrawer';
import TableWithVerticalLabels from 'common/components/tables/TableWithVerticalLabels';

const InfoPage = styled.div`
  flex-direction: row;
  justify-content: left;
  align-items: left;
  text-align: left;
  padding: 2rem;
  background-color: #ececec;
`;

const ActivitiesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: flex-start;
  align-content: flex-start;
`;

const TableContainer = styled.div`
  font-size: 15px;
  vertical-align: top;
  float: left;
  margin-top: 40px;
  align-items: flex-start;
`;

const Button = styled.button`
  background-color: #005696;
  color: #ececec;
  font-weight: bold;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background-color: #218bda;
  }
`;

// Helper function to build API URLs
const buildUrl = (endpoint) =>
  `${process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '')}${endpoint}`;

export default function Activities() {
  const columns = [
    {
      key: 'name',
      label: 'Activity',
      render: (activity) => (
        <a
          href={`/activity/${activity.schedule?.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {activity.schedule?.name || 'No name'}
        </a>
      ),
    },
    {
      key: 'declined',
      label: 'Declined?',
      render: (activity) => (activity.declined ? 'Yes' : 'No'),
    },
    { key: 'rating', label: 'Rating' },
    { key: 'date', label: 'Date' },
  ];
  const { id } = useParams();
  const [participant, setParticipant] = useState(null);
  const [participantName, setParticipantName] = useState('Minnie May');
  const [headerError, setHeaderError] = useState(null);
  const [monthlyActivitiesError, setMonthlyActivitiesError] = useState(null);
  const [aggregateActivitiesError, setAggregateActivitiesError] =
    useState(null);

  const [monthlyReportActivities, setmonthlyReportActivities] = useState([]);
  const [aggregateReportActivities, setAggregateReportActivities] = useState(
    []
  );
  const [month, setMonth] = useState('04');
  const [year, setYear] = useState('2025');
  const [startMonth, setStartMonth] = useState('01');
  const [endMonth, setEndMonth] = useState('12');
  const [startYear, setStartYear] = useState('2025');
  const [endYear, setEndYear] = useState('2025');

  const handleExportMonthlyReport = () => {
    if (!participantName) return;
    generateMonthlyActivityParticipationReport(
      monthlyReportActivities,
      participantName,
      year,
      month
    );
  };
  const handleExportAggregateReport = () => {
    if (!participantName) return;
    generateAggregateActivityReport(
      aggregateReportActivities,
      participantName,
      startMonth,
      startYear,
      endMonth,
      endYear
    );
  };
  const startDate = (month, year) => {
    const startDate = new Date(year, month - 1, 1);
    return startDate.toISOString().split('T')[0];
  };

  const endDate = (month, year) => {
    const endDate = new Date(year, month, 0);
    return endDate.toISOString().split('T')[0];
  };
  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const startDateforMonthlyReport = startDate(month, year);
        const endDateforMonthlyReport = endDate(month, year);
        const startDateforAggregateReport = startDate(startMonth, startYear);
        const endDateforAggregateReport = endDate(endMonth, endYear);
        const [responseMonthlyReport, responseAggregateReport] =
          await Promise.all([
            fetch(
              buildUrl(
                `/participants/${id}/activity-logs?start=${startDateforMonthlyReport}&end=${endDateforMonthlyReport}`
              )
            ),
            fetch(
              buildUrl(
                `/participants/${id}/activity-logs?start=${startDateforAggregateReport}&end=${endDateforAggregateReport}`
              )
            ),
          ]);

        if (!responseMonthlyReport.ok) {
          const errorData = await responseMonthlyReport.json();
          throw new Error(
            errorData.error || 'Failed to fetch monthly activity logs'
          );
        }
        if (!responseAggregateReport.ok) {
          const errorData = await responseAggregateReport.json();
          throw new Error(
            errorData.error || 'Failed to fetch aggregate activity logs'
          );
        }

        const monthlyData = await responseMonthlyReport.json();
        const aggregateData = await responseAggregateReport.json();
        setmonthlyReportActivities(monthlyData);
        setAggregateReportActivities(aggregateData);
        console.log('Fetched monthly report activities:', monthlyData);
        console.log('Fetched aggregate report activities:', aggregateData);
      } catch (err) {
        console.error('Error fetching activity logs:', err.message);
        setMonthlyActivitiesError('Error fetching monthly activity logs');
        setAggregateActivitiesError('Error fetching aggregate activity logs');
      }
    };
    setAggregateActivitiesError(null);
    setMonthlyActivitiesError(null);
    fetchActivityLogs();
  }, [startMonth, startYear, endMonth, endYear, month, year, id]);
  // Fetch participant data for header and reports
  useEffect(() => {
    const fetchHeaderData = async () => {
      setHeaderError(null);
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(buildUrl(`/participants/${id}`), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch participant data');
        }
        const participantData = await response.json();
        setParticipant(participantData);
        setParticipantName(
          `${participantData.participant_general_info.first_name} ${participantData.participant_general_info.last_name}`
        );
        console.log('Participant data:', participantData);
      } catch (err) {
        setHeaderError(err.message);
        console.error('Error fetching data:', err);
      }
    };
    fetchHeaderData();
  }, [id]);
  return (
    <InfoPage>
      <MenuDrawer />
      <Header participant={participant} error={headerError} />
      <ParticipantNavbar />
      <ActivitiesContainer>
        <TableContainer>
          <MonthYearDropdown
            monthLabel='Month:'
            yearLabel='Year:'
            month={month}
            year={year}
            onMonthChange={setMonth}
            onYearChange={setYear}
          />
          <TableWithVerticalLabels
            data={monthlyReportActivities}
            columns={columns}
            error={monthlyActivitiesError}
          />
          <Button onClick={handleExportMonthlyReport}>
            Export Monthly Report
          </Button>
        </TableContainer>
        <TableContainer>
          <MonthYearDropdown
            monthLabel='Start Month:'
            yearLabel='Start Year:'
            month={startMonth}
            year={startYear}
            onMonthChange={setStartMonth}
            onYearChange={setStartYear}
          />
          <MonthYearDropdown
            monthLabel='End Month:'
            yearLabel='End Year:'
            month={endMonth}
            year={endYear}
            onMonthChange={setEndMonth}
            onYearChange={setEndYear}
          />
          <TableWithVerticalLabels
            data={aggregateReportActivities}
            columns={columns}
            error={aggregateActivitiesError}
          />
          <Button onClick={handleExportAggregateReport}>
            Export Aggregate Report
          </Button>
        </TableContainer>
      </ActivitiesContainer>
    </InfoPage>
  );
}
