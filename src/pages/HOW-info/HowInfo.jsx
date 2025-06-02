import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import Header from 'common/components/Header';
import HomeButton from 'common/components/HomeButton';
import ParticipantNavbar from 'common/components/ParticipantNavBar';
import HowInfoTable, {
  DataFieldForm,
  FallForm,
  HospitalizationForm,
  ProgramForm,
  ToiletingForm,
} from 'common/components/how-info/HowInfoTables';

const InfoPage = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background-color: #ececec;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const Loading = styled.div`
  font-size: 18px;
  color: #999;
`;

// Helper function to build API URLs
const buildUrl = (endpoint) =>
  `${process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '')}${endpoint}`;

// Column definitions for each table
const programColumns = [
  {
    key: 'program_type',
    label: 'Program',
    type: 'select',
    options: ['Day Program', 'Mind Matters', 'Both', 'Other'],
  },
  { key: 'first_call', label: 'First Call', type: 'date' },
  { key: 'first_day', label: 'First Day', type: 'date' },
  {
    key: 'referral',
    label: 'Referral',
    type: 'select',
    hasEmptyOption: true,
    options: [
      "Alzheimer's Association",
      'CommunityEd',
      'Family member',
      'Friend',
      'Home care agency',
      'Hospital',
      'HOW program',
      'Other',
    ],
  },
  { key: 'discharge_date', label: 'Discharge Date', type: 'date' },
  {
    key: 'discharge_reason',
    label: 'Discharge Reason',
    type: 'select',
    hasEmptyOption: true,
    options: [
      'Assisted living',
      'Caregiver death',
      'Caregiver illness',
      'Does not meet program criteria',
      'Goals/Services completed',
      'Home care',
      'Moved or relocated',
      'Self-discharge',
      'Respite',
      'Other',
    ],
  },
];

const dataFieldColumns = [
  {
    key: 'data_field',
    label: 'Data Field',
    type: 'select',
    options: [
      'Sources of funding',
      'Caregiver relationship',
      'Insurance type',
      'Primary care physician',
      'Emergency contact',
    ],
  },
  { key: 'data_value', label: 'Value', type: 'text' },
  { key: 'date_changed', label: 'Date Changed', type: 'date' },
];

const hospitalizationColumns = [
  { key: 'incident_date', label: 'Date', type: 'date' },
  { key: 'hospitalization', label: 'Hospitalization?', type: 'boolean' },
];

const fallColumns = [
  { key: 'fall_date', label: 'Date', type: 'date' },
  { key: 'fall_in_program', label: 'In Program?', type: 'boolean' },
];

const toiletingColumns = [
  { key: 'date', label: 'Date', type: 'date' },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    options: ['B.M.', 'Urination', 'Both'],
  },
  { key: 'assistance', label: 'Assistance?', type: 'boolean' },
];

export default function HowInfo() {
  const { id } = useParams();
  const [participantInfo, setParticipantInfo] = useState(null);
  const [howPrograms, setHowPrograms] = useState([]);
  const [howDataFields, setHowDataFields] = useState([]);
  const [howHospitalizations, setHowHospitalizations] = useState([]);
  const [howFalls, setHowFalls] = useState([]);
  const [howToileting, setHowToileting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHowInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch participant data
      const participantResponse = await fetch(buildUrl(`/participants/${id}`));
      if (!participantResponse.ok) {
        throw new Error('Failed to fetch participant data');
      }
      const participantData = await participantResponse.json();

      // Fetch HOW info
      const howResponse = await fetch(buildUrl(`/participants/how/${id}`));
      if (!howResponse.ok) {
        const errorData = await howResponse.json();
        throw new Error(errorData.error || 'Failed to fetch HOW info');
      }

      const howData = await howResponse.json();
      setParticipantInfo(participantData);
      setHowPrograms(howData.participant_how_programs || []);
      setHowDataFields(howData.participant_how_data_fields || []);
      setHowHospitalizations(howData.participant_how_hospitalization || []);
      setHowFalls(howData.participant_how_falls || []);
      setHowToileting(howData.participant_how_toileting || []);
    } catch (err) {
      console.error('Error fetching HOW info:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHowInfo();
  }, [id]);

  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <Loading>Error: {error}</Loading>;

  return (
    <InfoPage>
      <Header participant={participantInfo} />
      <HomeButton />
      <ParticipantNavbar />

      <Section>
        <HowInfoTable
          title='HOW Program Info'
          data={howPrograms}
          columns={programColumns}
          tableType='programs'
          participantId={id}
          onDataUpdate={fetchHowInfo}
          newRecordForm={<ProgramForm />}
        />
      </Section>

      <Section>
        <HowInfoTable
          title='HOW Data Fields'
          data={howDataFields}
          columns={dataFieldColumns}
          tableType='dataFields'
          participantId={id}
          onDataUpdate={fetchHowInfo}
          newRecordForm={<DataFieldForm />}
        />
      </Section>

      <Section>
        <HowInfoTable
          title='Hospitalization/ER Visits'
          data={howHospitalizations}
          columns={hospitalizationColumns}
          tableType='hospitalizations'
          participantId={id}
          onDataUpdate={fetchHowInfo}
          newRecordForm={<HospitalizationForm />}
        />
      </Section>

      <Section>
        <HowInfoTable
          title='Falls'
          data={howFalls}
          columns={fallColumns}
          tableType='falls'
          participantId={id}
          onDataUpdate={fetchHowInfo}
          newRecordForm={<FallForm />}
        />
      </Section>

      <Section>
        <HowInfoTable
          title='Toileting'
          data={howToileting}
          columns={toiletingColumns}
          tableType='toileting'
          participantId={id}
          onDataUpdate={fetchHowInfo}
          newRecordForm={<ToiletingForm />}
        />
      </Section>
    </InfoPage>
  );
}
