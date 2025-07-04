import React, { useEffect, useState } from 'react';

import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

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

const TablesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 2rem;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const Loading = styled.div`
  font-size: 18px;
  color: #999;
`;

const CareSearchInput = styled.div`
  margin-bottom: 1rem;
`;

export default function GeneralInfo() {
  const { id } = useParams();
  const [generalInfo, setGeneralInfo] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [participantInfo, setParticipantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [careSearchTerm, setCareSearchTerm] = useState('');
  const [carePartners, setCarePartners] = useState([]);
  const [attachedCarePartners, setAttachedCarePartners] = useState([]);
  const [error, setError] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchData();
  }, [id, API_BASE_URL]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [participantRes, carePartnersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/participants/${id}`, {
          credentials: 'include',
        }),
        fetch(`${API_BASE_URL}/participants/carepartners`, {
          credentials: 'include',
        }),
      ]);

      if (!participantRes.ok) {
        throw new Error(`API error: ${participantRes.status}`);
      }
      if (!carePartnersRes.ok) {
        throw new Error(`API error: ${carePartnersRes.status}`);
      }

      const participantData = await participantRes.json();
      const carePartnersData = await carePartnersRes.json();

      console.log('Fetched Participant Data:', participantData);
      console.log('Fetched Care Partners Data:', carePartnersData);

      // Extract the data from the response
      setGeneralInfo(participantData.participant_general_info || null);
      setContactInfo(participantData.participant_address_and_contact || null);
      setParticipantInfo(participantData);
      setCarePartners(carePartnersData);
      setAttachedCarePartners(participantData.carepartners || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //searching to add care partners
  const handleSearchChange = (e) => {
    setCareSearchTerm(e.target.value);
  };

  console.log('CarePartners:', carePartners);
  console.log('CareSearchTerm:', careSearchTerm);

  const filteredCare = carePartners
    .filter(
      (cp) =>
        cp.participant_general_info &&
        cp.participant_general_info.status === 'Active'
    )
    .filter((carePartner) => {
      const searchLower = careSearchTerm.toLowerCase();
      return (
        carePartner.participant_general_info.first_name
          ?.toLowerCase()
          .includes(searchLower) ||
        carePartner.participant_general_info.last_name
          ?.toLowerCase()
          .includes(searchLower) ||
        carePartner.participant_general_info.status
          ?.toLowerCase()
          .includes(searchLower)
      );
    })
    .filter(
      (carePartner) =>
        !attachedCarePartners.some(
          (attached) => attached.carepartner_id === carePartner.id
        )
    );

  const getEmptyStateMessage = () => {
    if (careSearchTerm) {
      return 'No matching care partners found';
    }
    return 'No care partners available';
  };

  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <Loading>Error: {error}</Loading>;

  const handleChange = async (e, field, table, setState) => {
    const updatedValue = e.target.value;

    setState((prev) => ({
      ...prev,
      [field]: updatedValue,
    }));

    try {
      // Update through the backend API
      const response = await fetch(`${API_BASE_URL}/participants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          [table]: {
            [field]: updatedValue,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
    } catch (err) {
      console.error(`Error updating ${table}:`, err);
    }
  };

  const handleAddCaregiver = async (caregiverId) => {
    try {
      //fix this whole thing to cnnect to backend
      const res = await fetch(`${API_BASE_URL}/participants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participant_care: {
            carepartner_id: caregiverId,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add caregiver');
      }

      alert('Caregiver added successfully!');
      // maybe refresh data here later
      await fetchData();
      console.log('Updated attachedCarePartners:', attachedCarePartners);
    } catch (err) {
      console.error('Error adding caregiver:', err);
      alert('Failed to add caregiver');
    }
  };
  const handleRemove = async (caregiverId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/participants/participant_care/${id}?carepartner_id=${caregiverId}`, // `id` is participant's id
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );
      if (!res.ok) throw new Error('Failed to remove caregiver');
      alert('Caregiver removed!');
      await fetchData(); // refresh list after remove
    } catch (err) {
      console.error('Remove error:', err);
      alert('Failed to remove caregiver');
    }
  };

  const handlePrimaryToggle = async (caregiverId, primaryChecked) => {
    try {
      console.log(`Toggling primary for ${caregiverId} to ${primaryChecked}`);
      console.log('Sending update for:', {
        participant_care: {
          carepartner_id: caregiverId,
          primary: primaryChecked,
        },
      });
      const res = await fetch(`${API_BASE_URL}/participants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          participant_care: {
            carepartner_id: caregiverId,
            primary: primaryChecked,
          },
        }),
      });
      if (!res.ok) throw new Error('Failed to update primary status');
      alert('Primary status updated');
      await fetchData();
    } catch (err) {
      console.error('Primary update error:', err);
      alert('Failed to update');
    }
  };

  return (
    <InfoPage>
      <MenuDrawer />
      <Header participant={participantInfo} />
      <ParticipantNavbar />
      <TablesContainer>
        <TableContainer>
          <TableLabel>Participant Info</TableLabel>
          <Table>
            <TableHead>
              {generalInfo &&
                Object.keys(generalInfo)
                  .filter((key) => key !== 'id' && key !== 'status')
                  .map((key) => (
                    <TableRow key={key}>
                      <TableRowLabel>
                        {key
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </TableRowLabel>
                      <TableCell>
                        <input
                          type='text'
                          value={generalInfo[key] || ''}
                          onChange={(e) =>
                            handleChange(
                              e,
                              key,
                              'participant_general_info',
                              setGeneralInfo
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
            </TableHead>
          </Table>
        </TableContainer>

        <TableContainer>
          <TableLabel>Address and Contact Info</TableLabel>
          <Table>
            <tbody>
              {contactInfo &&
                Object.keys(contactInfo)
                  .filter((key) => key !== 'id')
                  .map((key) => (
                    <TableRow key={key}>
                      <TableRowLabel>
                        {key
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                        :
                      </TableRowLabel>
                      <TableCell>
                        <input
                          type='text'
                          value={contactInfo[key] || ''}
                          onChange={(e) =>
                            handleChange(
                              e,
                              key,
                              'participant_address_and_contact',
                              setContactInfo
                            )
                          }
                          style={{
                            background: 'transparent', // Match table background
                            border: 'none', // Remove border
                            outline: 'none', // Remove focus outline
                            fontSize: '15px', // Match table text
                            padding: '5px', // Add some spacing
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
            </tbody>
          </Table>
        </TableContainer>

        <TableContainer>
          <TableLabel>Care Partners</TableLabel>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: '25px',
              padding: '10px 20px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              marginBottom: '15px',
              width: '90%',
            }}
          >
            <span style={{ marginRight: '10px' }}>🔍</span>
            <input
              type='text'
              placeholder='Search care partners...'
              value={careSearchTerm}
              onChange={handleSearchChange}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '15px',
              }}
            />
          </div>
          {careSearchTerm && (
            <CareSearchInput>
              <Table>
                <tbody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className='text-center py-6'>
                        Loading people...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className='text-center py-6 text-red-600'
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : filteredCare.length > 0 ? (
                    filteredCare.map((caregiver, index) => (
                      <TableRow key={index} className='bg-white border-b'>
                        <TableCell className='py-4'>
                          <Link
                            to={`/participant/generalinfo/${caregiver.id}`}
                            className='text-blue-600 hover:underline'
                          >
                            {caregiver.participant_general_info.first_name}
                          </Link>
                        </TableCell>
                        <TableCell className='py-4'>
                          {caregiver.participant_general_info.last_name}
                        </TableCell>
                        <TableCell className='py-4'>
                          {caregiver.participant_general_info.status}
                        </TableCell>
                        <TableCell className='py-4'>
                          <button
                            onClick={() => handleAddCaregiver(caregiver.id)}
                            style={{
                              backgroundColor: '#4CAF50',
                              color: 'white',
                              padding: '5px 10px',
                              borderRadius: '5px',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '14px',
                            }}
                          >
                            Add
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className='text-center py-6 text-gray-500'
                      >
                        {getEmptyStateMessage()}
                      </TableCell>
                    </TableRow>
                  )}
                </tbody>
              </Table>
            </CareSearchInput>
          )}

          <Table>
            <tbody>
              {attachedCarePartners.length > 0 ? (
                attachedCarePartners.map((cp, idx) => {
                  console.log('Attached Care Partner:', cp);
                  const info = cp.carepartner?.participant_general_info;
                  const name = info
                    ? `${info.first_name ?? ''} ${info.last_name ?? ''}`.trim()
                    : 'Unknown';
                  const isPrimary = cp.primary;

                  return (
                    <TableRow key={idx}>
                      <TableCell style={{ width: '40px', textAlign: 'center' }}>
                        <div
                          onClick={() => handleRemove(cp.carepartner.id)}
                          style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            lineHeight: '24px',
                          }}
                          title='Remove care partner'
                        >
                          &minus;
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/participant/generalinfo/${cp.carepartner.id}`}
                          style={{
                            textDecoration: 'underline',
                          }}
                        >
                          {name}
                        </Link>
                      </TableCell>
                      <TableCell colSpan={2} style={{ textAlign: 'right' }}>
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <span>Primary</span>
                          <input
                            type='checkbox'
                            checked={isPrimary}
                            onChange={() => {
                              const caregiverId =
                                cp.carepartner.id || cp.carepartner?.id;
                              if (caregiverId) {
                                handlePrimaryToggle(caregiverId, !isPrimary);
                              } else {
                                console.error('Missing carepartner ID', cp);
                              }
                            }}
                          />
                        </label>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>No attached care partners.</TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </TableContainer>
      </TablesContainer>
    </InfoPage>
  );
}
