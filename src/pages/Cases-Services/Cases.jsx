import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import Header from 'common/components/Header';
import ParticipantNavbar from 'common/components/ParticipantNavBar';
import EditServiceModal from 'common/components/form/EditingServicesModal';
import EditIcon from 'common/components/icons/EditIcon';
import MenuDrawer from 'common/components/navigation/MenuDrawer';
import TableWithVerticalLabels from 'common/components/tables/TableWithVerticalLabels';

const InfoPage = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3rem;
  font-size: 15px;
`;

const TableContainer = styled.div`
  vertical-align: top;
  float: left;
  margin-top: 40px;
  align-items: flex-start;
`;

const Headline = styled.h2`
  font-size: 20px;
  margin-top: 50px;
  margin-bottom: 0px;
  color: black;
  text-align: left;
`;

const AddServiceForm = styled.form`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-end;
  align-content: center;
`;

const InputBox = styled.input`
  box-sizing: border-box;
  padding: 15px;
  border: 1px solid #ececec;
  border-radius: 10px;
  margin-top: 0.5rem;
  height: 49px;
  &:focus {
    outline: 1px solid #218bda;
  }
`;

const TextAreaBox = styled.textarea`
  box-sizing: border-box;
  rows: 1;
  padding: 15px;
  border: 1px solid #ececec;
  border-radius: 10px;
  resize: horizontal;
  margin-top: 0.5rem;
  height: 49px;
  width: 33rem;
  &:focus {
    outline: 1px solid #218bda;
  }
`;

const Button = styled.button`
  height: 49px;
  box-sizing: border-box;
  background-color: #005696;
  color: #ececec;
  border: none;
  padding: 10px 30px;
  margin-top: 1.5rem;
  margin-right: 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #218bda;
  }
`;

const LableInputBox = styled.label`
  display: flex;
  flex-direction: column;
  margin-right: 2rem;
  margin-top: 1.5rem;
`;

const buildUrl = (endpoint) =>
  `${process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '')}${endpoint}`;

const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-');
  return `${month}/${day}/${year}`;
};

const getTodayDateStr = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Cases() {
  const { id } = useParams();
  const [services, setServices] = useState([]);
  const [participant, setParticipant] = useState(null);
  const [headerError, setHeaderError] = useState(null);
  const [servicesError, setServicesError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newService, setNewService] = useState({
    code: '',
    service_type: '',
    minutes: '',
    units: '',
    posting_date: getTodayDateStr(),
    service_date: getTodayDateStr(),
    update_by: '',
    update_date: getTodayDateStr(),
    notes: '',
  });
  const columns = [
    {
      key: 'edit',
      label: 'Edit',
      render: (service) => (
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
          onClick={() => {
            setEditingService(service);
            setUpdateError(null);
            setShowEditModal(true);
          }}
          aria-label='Edit service'
          type='button'
        >
          <EditIcon />
        </button>
      ),
    },
    { key: 'code', label: 'Service' },
    { key: 'service_type', label: 'Service Type' },
    { key: 'minutes', label: 'Minutes' },
    { key: 'units', label: 'Units' },
    {
      key: 'posting_date',
      label: 'Posting Date',
      render: (service) => formatDate(service.posting_date) || '',
    },
    {
      key: 'service_date',
      label: 'Service Date',
      render: (service) => formatDate(service.service_date) || '',
    },
    { key: 'update_by', label: 'Update By' },
    {
      key: 'update_date',
      label: 'Update Date',
      render: (service) => formatDate(service.update_date) || '',
    },
    { key: 'notes', label: 'Notes' },
  ];

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
      setUpdateError(`${err.message}. Please check your values and try again.`);
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
      setUpdateError('Failed to delete service');
    }
  };

  // Fetch participant data and services on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    };
    const fetchParticipant = async () => {
      setHeaderError(null);
      try {
        const HeaderResponse = await fetch(
          buildUrl(`/participants/${id}`),
          requestOptions
        );
        if (!HeaderResponse.ok) {
          const errorData = await HeaderResponse.json();
          throw new Error(
            errorData.error || 'Failed to fetch participant data'
          );
        }
        const participantData = await HeaderResponse.json();
        setParticipant(participantData);
        console.log('Participant data:', participantData);
      } catch (err) {
        setHeaderError('Error fetching participant data');
        console.error('Error fetching participant:', err);
      }
    };

    const fetchServices = async () => {
      setServicesError(null);
      try {
        const ServicesResponse = await fetch(
          buildUrl(`/participants/services/${id}`),
          requestOptions
        );
        if (!ServicesResponse.ok) {
          const errorData = await ServicesResponse.json();
          throw new Error(
            errorData.error || 'Failed to fetch participant services'
          );
        }
        const servicesData = await ServicesResponse.json();
        setServices(servicesData || []);
      } catch (err) {
        setServicesError('Error fetching participant services');
        console.error('Error fetching services:', err);
      }
    };
    setUpdateError(null);
    setEditingService(null);
    fetchParticipant();
    fetchServices();
  }, [id]);
  return (
    <InfoPage>
      <MenuDrawer />
      <Header participant={participant} error={headerError} />
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
          updateError={updateError}
        />
      )}
      <TableContainer>
        <TableWithVerticalLabels
          data={services}
          columns={columns}
          error={servicesError}
          fullWidth
        />
      </TableContainer>
      <Headline>Add New Service</Headline>
      <AddServiceForm onSubmit={handleSubmit}>
        <LableInputBox>
          Service:
          <InputBox
            type='text'
            name='code'
            value={newService.code || ''}
            onChange={handleChange}
          />
        </LableInputBox>
        <LableInputBox>
          Service Type:
          <InputBox
            type='text'
            name='service_type'
            value={newService.service_type || ''}
            onChange={handleChange}
          />
        </LableInputBox>
        <LableInputBox>
          Minutes:
          <InputBox
            type='number'
            name='minutes'
            value={newService.minutes || ''}
            onChange={handleChange}
          />
        </LableInputBox>
        <LableInputBox>
          Units:
          <InputBox
            type='number'
            name='units'
            value={newService.units || ''}
            onChange={handleChange}
          />
        </LableInputBox>
        <LableInputBox>
          Posting Date:
          <InputBox
            type='date'
            name='posting_date'
            value={newService.posting_date || ''}
            onChange={handleChange}
          />
        </LableInputBox>
        <LableInputBox>
          Service Date:
          <InputBox
            type='date'
            name='service_date'
            value={newService.service_date || ''}
            onChange={handleChange}
          />
        </LableInputBox>
        <LableInputBox>
          Update By:
          <InputBox
            type='text'
            name='update_by'
            value={newService.update_by || ''}
            onChange={handleChange}
          />
        </LableInputBox>
        <LableInputBox>
          Update Date:
          <InputBox
            type='date'
            name='update_date'
            value={newService.update_date || ''}
            onChange={handleChange}
          />
        </LableInputBox>
        <LableInputBox>
          Notes:
          <TextAreaBox
            name='notes'
            value={newService.notes || ''}
            onChange={handleChange}
          />
        </LableInputBox>
        <Button type='submit'>Add</Button>
        <Button type='button' onClick={() => setNewService({})}>
          Reset
        </Button>
      </AddServiceForm>
    </InfoPage>
  );
}
