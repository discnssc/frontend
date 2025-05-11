import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// import GoogleButton from 'common/components/GoogleButton';
import { Form, FormTitle } from 'common/components/form/Form';
import { Input } from 'common/components/form/Input';
import SubmitButton from 'common/components/form/SubmitButton';
import { RedSpan } from 'common/components/form/styles';
import { useUser } from 'common/contexts/UserContext';

import { StyledPage } from './styles';

const StyledLink = styled(Link)`
  color: var(--dark-blue);
  text-decoration: none;
  font-size: 0.9rem;
  margin-top: -30px;
  width: 500px;
  text-align: right;
  padding: 0px;

  &:hover {
    text-decoration: underline;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
`;

export default function Login() {
  const navigate = useNavigate();
  // const { login, googleAuth } = useUser();
  const { login } = useUser();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formState.email, formState.password);
      navigate('/', { replace: true });
    } catch (error) {
      setError(error.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleLogin = async () => {
  //   try {
  //     await googleAuth();
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };

  return (
    <StyledPage>
      <ImageContainer>
        <img
          src='/nssc-logo.svg'
          alt='NSSC logo'
          style={{ marginTop: '-80px' }}
        />
      </ImageContainer>
      <Form onSubmit={handleSubmit}>
        <FormTitle>Staff Portal Login</FormTitle>
        {error && <RedSpan>{error}</RedSpan>}
        <Input.Text
          title='Email'
          name='email'
          placeholder='jsmith@example.com'
          value={formState.email}
          onChange={handleChange}
          required
        />
        <Input.Password
          title='Password'
          name='password'
          value={formState.password}
          onChange={handleChange}
          required
        />
        <StyledLink to='/forgot-password'>Forgot Password?</StyledLink>
        <SubmitButton disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </SubmitButton>
        <div style={{ width: '400px', fontStyle: 'italic' }}>
          If you do not have an existing account, please see an admin to receive
          a registration invite.
        </div>
      </Form>
    </StyledPage>
  );
}
