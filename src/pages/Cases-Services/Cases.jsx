import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import Header from 'common/components/Header';
import ParticipantNavbar from 'common/components/ParticipantNavBar';
import EditServiceModal from 'common/components/form/EditingServicesModal';
import MenuDrawer from 'common/components/navigation/MenuDrawer';

const InfoPage = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;
const Loading = styled.div`
  font-size: 18px;
  color: #999;
`;

const TableContainer = styled.div`
  font-size: 15px;
  vertical-align: top;
  float: left;
  margin-top: 40px;
  align-items: flex-start;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  vertical-align: top;
  margin-right: 2rem;
  overflow: hidden;
`;

const TableRow = styled.tr`
  width: 100%;
  font-size: 15px;
`;

const LableTableCell = styled.td`
  padding: 15px;
  text-align: left;
  vertical-align: center;
  background: #005696;
  color: #ffffff;
  justify-content: center;
  flex-shrink: 0;
  font-weight: bold;
  &:not(:last-child) {
    border-right: 0.5px solid #ececec;
  }
  &:first-child {
    border-top-left-radius: 10px;
    width: 5%;
  }
  &:nth-child(2) {
    width: 5%;
  }
  &:nth-child(3) {
    width: 16%;
  }
  &:nth-child(4) {
    width: 5%;
  }
  &:nth-child(5) {
    width: 5%;
  }
  &:nth-child(6) {
    width: 16%;
  }
  &:nth-child(7) {
    width: 16%;
  }
  &:nth-child(8) {
    width: 16%;
  }
  &:last-child {
    border-top-right-radius: 10px;
    width: 16%;
  }
`;
const ScrollableTableWrapper = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;
const TableCell = styled.td`
  padding: 15px;
  text-align: left;
  vertical-align: center;
  background-color: #ffffff;
  border: 0.5px solid #ececec;
  justify-content: center;
  flex-shrink: 0;
`;

const InputBox = styled.input`
  padding: 5px;
  border: 1px solid #ececec;
  margin-top: 0.5rem;
  &:focus {
    outline: 1px solid #218bda;
  }
`;
const Headline = styled.h2`
  font-size: 24px;
  margin-top: 50px;
  color: #005696;
  text-align: left;
`;
const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  label {
    margin: 0.5rem;
    font-weight: bold;
  }
`;
const Button = styled.button`
  background-color: #005696;
  color: #ececec;
  border: none;
  padding: 10px 20px;
  margin-right: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background-color: #218bda;
  }
`;
const AddServiceForm = styled.form`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`;
const LableInputBox = styled.label`
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
`;

const buildUrl = (endpoint) =>
  `${process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '')}${endpoint}`;

const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-');
  return `${month}/${day}/${year}`;
};

export default function Cases() {
  const { id } = useParams();
  const [services, setServices] = useState([]);
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newService, setNewService] = useState({
    code: '',
    service_type: '',
    minutes: '',
    units: '',
    posting_date: '',
    service_date: '',
    update_by: '',
    update_date: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    updateService(newService);
  };
  const updateService = async (service) => {
    try {
      const payload = { participant_services: service };
      const serviceResponse = await fetch(
        buildUrl(`/participants/${participant.id}`),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        }
      );
      if (!serviceResponse.ok) {
        throw new Error('Failed to update service');
      }
      window.location.reload();
    } catch (err) {
      console.error('Error updating service:', err);
      setError('Failed to update service');
    }
  };
  const deleteService = async (service) => {
    try {
      if (!window.confirm('Are you sure you want to delete this service?')) {
        return;
      }
      const response = await fetch(
        buildUrl(
          `/participants/participant_services/${participant.id}?entry_id=${service.entry_id}`
        ),
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          credentials: 'include',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete service');
      }
      setServices((prev) =>
        prev.filter((s) => s.entry_id !== service.entry_id)
      );
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('Failed to delete service');
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
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

        // Extract data from the response
        setParticipant(participantData);
        setServices(participantData.participant_services || []);
        console.log('Participant data:', participantData);
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
  return (
    <InfoPage>
      <MenuDrawer />
      <Header participant={participant} />
      <ParticipantNavbar />
      {showEditModal && (
        <EditServiceModal
          service={editingService}
          onClose={() => setShowEditModal(false)}
          onSave={updateService}
          onDelete={() => {
            deleteService(editingService);
            setShowEditModal(false);
          }}
        />
      )}
      <TableContainer>
        <ScrollableTableWrapper>
          <Table>
            <TableRow>
              <LableTableCell>Edit</LableTableCell>
              <LableTableCell>Service</LableTableCell>
              <LableTableCell>Service Type</LableTableCell>
              <LableTableCell>Minutes</LableTableCell>
              <LableTableCell>Units</LableTableCell>
              <LableTableCell>Posting Date</LableTableCell>
              <LableTableCell>Service Date</LableTableCell>
              <LableTableCell>Update By</LableTableCell>
              <LableTableCell>Update Date</LableTableCell>
            </TableRow>
            <tbody>
              {services &&
                services.map((service) => (
                  <TableRow key={service.entry_id}>
                    <TableCell>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                        onClick={() => {
                          setEditingService(service);
                          setShowEditModal(true);
                        }}
                        aria-label='Edit service'
                        type='button'
                      >
                        <span role='img' aria-label='edit'>
                          ✏️
                        </span>
                      </button>
                    </TableCell>
                    <TableCell>{service.code || ''}</TableCell>
                    <TableCell>{service.service_type || ''}</TableCell>
                    <TableCell>{service.minutes || ''}</TableCell>
                    <TableCell>{service.units || ''}</TableCell>
                    <TableCell>
                      {formatDate(service.posting_date) || ''}
                    </TableCell>
                    <TableCell>
                      {formatDate(service.service_date) || ''}
                    </TableCell>
                    <TableCell>{service.update_by || ''}</TableCell>
                    <TableCell>
                      {formatDate(service.update_date) || ''}
                    </TableCell>
                  </TableRow>
                ))}
            </tbody>
          </Table>
        </ScrollableTableWrapper>
      </TableContainer>
      <Headline>Add New Service</Headline>
      <AddServiceForm onSubmit={handleSubmit}>
        <LableInputBox>
          Service
          <InputBox
            type='text'
            name='code'
            value={newService.code || ''}
            onChange={handleChange}
          />
        </LableInputBox>
        <LableInputBox>
          Service Type
          <InputBox
            type='text'
            name='service_type'
            value={newService.service_type || ''}
            onChange={handleChange}
          />
        </LableInputBox>
        <LableInputBox>
          Minutes
          <InputBox
            type='number'
            name='minutes'
            value={newService.minutes || ''}
            onChange={handleChange}
          />
        </LableInputBox>
        <LableInputBox>
          Units
          <InputBox
            type='number'
            name='units'
            value={newService.units || ''}
            onChange={handleChange}
          />
        </LableInputBox>
        <LableInputBox>
          Posting Date
          <InputBox
            type='date'
            name='posting_date'
            value={newService.posting_date || ''}
            onChange={handleChange}
          />
        </LableInputBox>
        <LableInputBox>
          Service Date
          <InputBox
            type='date'
            name='service_date'
            value={newService.service_date || ''}
            onChange={handleChange}
          />
        </LableInputBox>
        <LableInputBox>
          Update By
          <InputBox
            type='text'
            name='update_by'
            value={newService.update_by || ''}
            onChange={handleChange}
          />
        </LableInputBox>
        <LableInputBox>
          Update Date
          <InputBox
            type='date'
            name='update_date'
            value={newService.update_date || ''}
            onChange={handleChange}
          />
        </LableInputBox>
        <FormRow>
          <Button type='submit'>Add</Button>
          <Button type='button' onClick={() => setNewService({})}>
            Reset
          </Button>
        </FormRow>
      </AddServiceForm>
    </InfoPage>
  );
}
