import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { generateDemographicsReport } from 'utils/excelExport.js';

import Header from 'common/components/Header';
import ParticipantNavbar from 'common/components/ParticipantNavBar';
import MenuDrawer from 'common/components/navigation/MenuDrawer';
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableLabel,
  TableRow,
  TableRowLabel,
} from 'common/components/tables/Tables';

const InfoPage = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  margin-left: 0;
  background-color: #ececec;
`;

const TableWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
`;

const Loading = styled.div`
  font-size: 18px;
  color: #999;
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

// Helper function to build API URLs
const buildUrl = (endpoint) =>
  `${process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '')}${endpoint}`;

export default function Demographics() {
  const { id } = useParams();
  const [demographicInfo, setDemographicInfo] = useState(null);
  const [participantInfo, setParticipantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get auth token from localStorage
        const token = localStorage.getItem('authToken');

        // Fetch participant data from backend
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

        const data = await response.json();

        // Extract data from the response
        const demographicData = data.participant_demographics;
        const participantData = data;

        console.log('Fetched Demographic Info:', demographicData);
        console.log('Fetched Participant Info:', participantData);

        setDemographicInfo(demographicData);
        setParticipantInfo(participantData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <Loading>Error: {error}</Loading>;

  // List of known boolean fields
  const booleanFields = [
    'hispanic_or_latino',
    'living_alone',
    'live_in_nursing_home',
    'case_worker_risk',
    'has_pet',
    'homeless',
    'female_headed_household',
    'frail_disabled',
    'limited_english',
  ];

  const incomeOptions = [
    '$0 - $25,000',
    '$25,001 - $50,000',
    '$50,001 - $100,000',
    '$100,001 - $200,000',
    '$200,001 - $500,000',
    '$500,001 - $1,000,000',
    '$1,000,000 and up',
  ];

  const maritalStatusOptions = [
    'Single',
    'Married',
    'Divorced',
    'Widowed',
    'Separated',
  ];

  const handleChange = async (e, field, table, setState) => {
    const isCheckbox = booleanFields.includes(field);
    const updatedValue = isCheckbox ? e.target.checked : e.target.value;

    // Update the local state
    setState((prev) => ({
      ...prev,
      [field]: updatedValue,
    }));

    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');

      // Create payload with only the updated table data
      const payload = {
        [table]: {
          [field]: updatedValue,
        },
      };

      // Send update to backend
      const response = await fetch(buildUrl(`/participants/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Update failed');
      }
    } catch (err) {
      console.error(`Error updating ${table}:`, err);
    }
  };

  const handleExportDemographicsReport = () => {
    if (!participantInfo || !demographicInfo) return;
    const participantName = `${participantInfo.participant_general_info.first_name} ${participantInfo.participant_general_info.last_name}`;
    generateDemographicsReport(demographicInfo, participantName);
  };

  return (
    <InfoPage>
      <MenuDrawer />
      <Header participant={participantInfo} />
      <ParticipantNavbar />
      <TableWrapper>
        <TableContainer>
          <TableLabel>Demographics</TableLabel>
          <Table>
            <TableHead>
              {demographicInfo &&
                Object.keys(demographicInfo)
                  .filter((key) => key !== 'id' && key !== 'status')
                  .map((key) => {
                    const isBoolean = booleanFields.includes(key);
                    const value = demographicInfo[key] || false;
                    return (
                      <TableRow key={key}>
                        <TableRowLabel>
                          {key
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                        </TableRowLabel>
                        <TableCell>
                          {isBoolean ? (
                            <input
                              type='checkbox'
                              checked={!!value}
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  key,
                                  'participant_demographics',
                                  setDemographicInfo
                                )
                              }
                            />
                          ) : key === 'income' ? (
                            <select
                              value={value || ''}
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  key,
                                  'participant_demographics',
                                  setDemographicInfo
                                )
                              }
                            >
                              <option value=''>Select income range</option>
                              {incomeOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : key === 'marital_status' ? (
                            <select
                              value={value || ''}
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  key,
                                  'participant_demographics',
                                  setDemographicInfo
                                )
                              }
                            >
                              <option value=''>Select marital status</option>
                              {maritalStatusOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type='text'
                              value={value || ''}
                              onChange={(e) =>
                                handleChange(
                                  e,
                                  key,
                                  'participant_demographics',
                                  setDemographicInfo
                                )
                              }
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableHead>
          </Table>
          <Button onClick={handleExportDemographicsReport}>
            Export Demographics Report
          </Button>
        </TableContainer>
      </TableWrapper>
    </InfoPage>
  );
}
