import React from 'react';

import { Link } from 'react-router-dom';

import { Form, FormTitle } from 'common/components/form/Form';

import { StyledCenterAlignPage } from './Invite';
import { StyledButton, StyledLink } from './styles';

export default function InviteLandingPage() {
  return (
    <StyledCenterAlignPage>
      <Form>
        <img
          src='/nssc-logo.svg'
          alt='NSSC logo'
          style={{ width: '130px', marginTop: '30px' }}
        />
        <FormTitle>
          <div style={{ width: '450px', textAlign: 'left' }}>
            You have been invited to register for the NSSC staff portal.
          </div>
        </FormTitle>
        <div
          style={{
            width: '450px',
            textAlign: 'left',
            lineHeight: '1.5',
            marginTop: '-30px',
          }}
        >
          <b>Invited By:</b> Cynthia Phon
          <br />
          <b>First Name:</b> John
          <br />
          <b>Last Name:</b> Doe
          <br />
          <b>Email:</b> john@gmail.com
          <br />
          <b>Role:</b> Volunteer
          <br />
        </div>
        <Link to='/set-password'>
          <StyledButton>This info looks correct.</StyledButton>
        </Link>
        <StyledLink>This info does not look correct.</StyledLink>
      </Form>
    </StyledCenterAlignPage>
  );
}
