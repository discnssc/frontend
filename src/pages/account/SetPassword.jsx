import { React, useState } from 'react';
import SubmitButton from 'common/components/form/SubmitButton';

import { ArrowLeft } from 'lucide-react';

import { Form, FormTitle } from 'common/components/form/Form';
import { Input } from 'common/components/form/Input';

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
