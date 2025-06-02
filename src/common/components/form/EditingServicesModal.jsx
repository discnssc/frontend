/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 600px;
  width: 100%;
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
const InputBox = styled.input`
  padding: 5px;
  margin-left: 0.8rem;
  border: 1px solid #ececec;
  &:focus {
    outline: 1px solid #218bda;
  }
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

export default function EditServiceModal({
  service,
  onClose,
  onSave,
  onDelete,
}) {
  const [serviceData, setServiceData] = useState({ ...service });

  useEffect(() => {
    setServiceData({ ...service });
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(serviceData);
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <form onSubmit={handleSubmit}>
          <FormRow>
            <label>
              Service
              <InputBox
                type='text'
                name='code'
                value={serviceData.code || ''}
                onChange={handleChange}
              />
            </label>
            <label>
              Service Type
              <InputBox
                type='text'
                name='service_type'
                value={serviceData.service_type || ''}
                onChange={handleChange}
              />
            </label>
          </FormRow>
          <FormRow>
            <label>
              Minutes
              <InputBox
                type='number'
                name='minutes'
                value={serviceData.minutes || ''}
                onChange={handleChange}
              />
            </label>
            <label>
              Units
              <InputBox
                type='number'
                name='units'
                value={serviceData.units || ''}
                onChange={handleChange}
              />
            </label>
          </FormRow>
          <FormRow>
            <label>
              Posting Date
              <InputBox
                type='date'
                name='posting_date'
                value={serviceData.posting_date || ''}
                onChange={handleChange}
              />
            </label>
            <label>
              Service Date
              <InputBox
                type='date'
                name='service_date'
                value={serviceData.service_date || ''}
                onChange={handleChange}
              />
            </label>
          </FormRow>
          <FormRow>
            <label>
              Update By
              <InputBox
                type='text'
                name='update_by'
                value={serviceData.update_by || ''}
                onChange={handleChange}
              />
            </label>
            <label>
              Update Date
              <InputBox
                type='date'
                name='update_date'
                value={serviceData.update_date || ''}
                onChange={handleChange}
              />
            </label>
          </FormRow>
          <FormRow>
            <Button type='submit'>Update</Button>
            <Button type='button' onClick={onDelete}>
              Delete
            </Button>
            <Button type='button' onClick={onClose}>
              Cancel
            </Button>
          </FormRow>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
}
