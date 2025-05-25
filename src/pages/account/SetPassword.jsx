import { React, useState } from 'react';

import { ArrowLeft } from 'lucide-react';

import { Form, FormTitle } from 'common/components/form/Form';
import { Input } from 'common/components/form/Input';
import SubmitButton from 'common/components/form/SubmitButton';

import { BackArrowContainer, StyledCenterAlignPage } from './Invite';

export default function SetPassword() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <StyledCenterAlignPage>
      <Form>
        <BackArrowContainer to='/signup'>
          <ArrowLeft />
        </BackArrowContainer>
        <FormTitle>Set Your Password</FormTitle>
        <Input.Password title='Password' />
        <SubmitButton onClick={() => {}} disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </SubmitButton>
      </Form>
    </StyledCenterAlignPage>
  );
}
