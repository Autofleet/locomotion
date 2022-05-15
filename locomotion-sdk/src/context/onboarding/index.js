import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import auth from '../../services/auth';
import Mixpanel from '../../services/Mixpanel';
import { useStateValue } from '../main';
import { loginVert, updateUser } from '../user/api';
import AppSettings from '../../services/app-settings';

const authContainer = () => {
  const [, dispatch] = useStateValue();
  const navigation = useNavigation()
  const [onboardingState, setOnboardingState] = useState({
    phoneNumber: '',
    firstName: '',
    lastName: ''
  })

  const getUserFromStorage = async () => {
    const res = await AppSettings.getSettings()
    setOnboardingState(res.userProfile)
  }

  useEffect(() => {
    getUserFromStorage()
  }, [])

  const navigateBasedOnUser = (user) => {
    if (!user.firstName || !user.lastName) {
      return navigation.navigate('AuthScreens', { screen: 'Name' })
    }
    navigation.navigate('MainApp')
  }

  const updateUserInfo = async (values) => {
    const user = await updateUser(values)
    dispatch({
      type: 'saveState',
      payload: {
        auth: true,
        userProfile: user,
      },
    });
    navigateBasedOnUser(user)
  }

  const onVert = async (code) => {
    try {
      const vertResponse = await loginVert({
        phoneNumber: onboardingState.phoneNumber,
        code,
      });

      if (vertResponse.status !== 'OK' || !vertResponse.refreshToken || !vertResponse.accessToken) {
        console.log('Bad vert with response', vertResponse);
        return false;
      }

      await auth.updateTokens(vertResponse.refreshToken, vertResponse.accessToken);
      const userProfile = vertResponse.userProfile || {};
      Mixpanel.setUser(userProfile)
      dispatch({
        type: 'saveState',
        payload: {
          auth: true,
          userProfile,
        },
      });
      navigateBasedOnUser(userProfile)
    } catch (e) {
      console.log('Bad vert with request', e);
      return false
    }
  };


  return {
    onboardingState,
    setOnboardingState,
    onVert,
    updateUserInfo,
    navigateBasedOnUser
  };
};
export default createContainer(authContainer);
