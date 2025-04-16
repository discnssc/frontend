import React, { useEffect, useState } from 'react';

import { createClient } from '@supabase/supabase-js';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import Header from 'common/components/Header';
import HomeButton from 'common/components/HomeButton';
import ParticipantNavbar from 'common/components/ParticipantNavBar';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const InfoPage = styled.div`
  flex-direction: row;
  justify-content: left;
  align-items: left;
  text-align: left;
  padding: 2rem;
`;

const TableContainer = styled.div`
  font-size: 15px;
  width: 45%;
  display: table;
  vertical-align: top;
  float: left;
  margin-left: 160px;
  margin-top: 40px;
  align-items: flex-start;
`;

const Table = styled.div`
  font-size: 15px;
  width: 45%;
  display: table;
  vertical-align: top;
  float: left;
  margin-right: 2rem;
  align-items: flex-start;
`;

const TableHead = styled.div`
  flex: 1 0 0;
  flex-direction: column;
  justify-content: left;
  align-items: left;
  text-align: left;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 1rem;
  align-items: flex-start;
`;

const TableRow = styled.tr`
  font-size: 15px;
`;

const TableLabel = styled.th`
  padding: 8px;
  text-align: left;
  vertical-align: center;
  background-color: #ffffff;
  font-weight: bold;
  border: 0.5px solid #aaaaaa;
`;

const TableCell = styled.td`
  padding: 8px;
  text-align: left;
  vertical-align: center;
  background-color: #ffffff;
  border: 0.5px solid #aaaaaa;
  justify-content: center;
  flex-shrink: 0;
`;

const Loading = styled.div`
  font-size: 18px;
  color: #999;
`;

export default function Demographics() {
  const { id } = useParams();
  const [generalInfo, setGeneralInfo] = useState(null);
  const [demographicInfo, setDemographicInfo] = useState(null);
  const [participantInfo, setParticipantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          { data: generalData, error: generalError },
          { data: demographicData, error: demographicError },
          { data: participantData, error: participantError },
        ] = await Promise.all([
          supabase
            .from('participant_general_info')
            .select('*')
            .eq('id', id)
            .single(),
          supabase
            .from('participant_demographics')
            .select('*')
            .eq('id', id)
            .single(),
          supabase
            .from('participants')
            .select('id, participant_created_at, participant_updated_at')
            .eq('id', id)
            .single(),
        ]);

        if (generalError) throw new Error(generalError.message);
        if (demographicError) throw new Error(demographicError.message);
        if (participantError) throw new Error(participantError.message);

        console.log('Fetched Demographic Info:', demographicData);
        console.log('Fetched General Info:', generalData);
        console.log('Fetched Participant Info:', participantData);

        setDemographicInfo(demographicData);
        setGeneralInfo(generalData);
        setParticipantInfo(participantData);
      } catch (err) {
        setError(err.message);
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

  const handleChange = async (e, field, table, setState) => {
    const isCheckbox = booleanFields.includes(field);
    const updatedValue = isCheckbox ? e.target.checked : e.target.value;

    setState((prev) => ({
      ...prev,
      [field]: updatedValue,
    }));

    try {
      const { error } = await supabase
        .from(table)
        .update({ [field]: updatedValue })
        .eq('id', id);

      if (error) throw new Error(error.message);
    } catch (err) {
      console.error(`Error updating ${table}:`, err);
    }
  };

  return (
    <InfoPage>
      <Header participant={{ ...generalInfo, ...participantInfo }} />
      <HomeButton />
      <ParticipantNavbar />
      <TableContainer>
        <TableHead>Demographics</TableHead>
        <Table>
          <tbody>
            {demographicInfo &&
              Object.keys(demographicInfo)
                .filter((key) => key !== 'id' && key !== 'status')
                .map((key) => {
                  const isBoolean = booleanFields.includes(key);
                  const value = demographicInfo[key] || false;

                  return (
                    <TableRow key={key}>
                      <TableLabel>
                        {key
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                        :
                      </TableLabel>
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
                            style={{
                              margin: '0',
                              width: '15px',
                              height: '15px',
                              cursor: 'pointer',
                            }}
                          />
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
                            style={{
                              background: 'transparent',
                              border: 'none',
                              outline: 'none',
                              fontSize: '15px',
                              padding: '5px',
                            }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </tbody>
        </Table>
      </TableContainer>
    </InfoPage>
  );
}
