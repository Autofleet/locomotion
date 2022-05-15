import React, { useState } from 'react';
import { createContainer } from 'unstated-next';
import { useStateValue } from '../main';
import { loginVert } from '../user/api';

const onboardingContainer = () => {
  const [, dispatch] = useStateValue();
  const [onboardingState, setOnboardingState] = useState({
    phoneNumber: '',
    firstName: '',
    lastName: ''
  })

  const onVert = async (code) => {
    try {
      const vertResponse = await loginVert({
        phoneNumber: onboardingState.phoneNumber,
        code,
      });

      if (vertResponse.status !== 'SUCCESS') {
        console.log('Bad vert with response', vertResponse);
        return false;
      }
      return true
    } catch (e) {
      console.log('Bad vert with request', e);
      return false
    }
  };


  return {
    onboardingState,
    setOnboardingState,
    onVert
  };
};
export default createContainer(onboardingContainer);
