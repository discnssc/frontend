import React from 'react';

import { Form, FormTitle } from 'common/components/form/Form';
import { StyledCenterAlignPage, BackArrowContainer } from './Invite';
import { ArrowLeft } from 'lucide-react';

export default function IncorrectInfo() {
  return (
    <StyledCenterAlignPage>
      <Form>
        <BackArrowContainer to='/signup'>
          <ArrowLeft />
        </BackArrowContainer>
        <FormTitle>
          <div style={{ width: '450px' }}>
            Please contact an admin to be sent an invite with the correct info.
          </div>
        </FormTitle>
      </Form>
    </StyledCenterAlignPage>
  );
}
