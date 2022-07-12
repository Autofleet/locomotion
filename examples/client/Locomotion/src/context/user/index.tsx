import React, {
  createContext, Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import crashlytics from '@react-native-firebase/crashlytics';
import Config from 'react-native-config';
import { StorageService } from '../../services';
import {
  getUserDetails, loginVert, sendEmailVerification, updateUser,
} from './api';
import auth from '../../services/auth';
import Mixpanel from '../../services/Mixpanel';
import PaymentsContext from '../payments';
import OneSignal from '../../services/one-signal';

const storageKey = 'clientProfile';

export interface User {
  id: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  email?: string;
  pushTokenId: string | null;
  pushUserId?: string | null;
  cards?: any;
  isPushEnabled: boolean;
}

interface UserContextInterface {
  setUser: (user: User | null) => void,
  user: User | null,
  updateState: (field: string, value: any) => void,
  getUserFromStorage: () => void,
  updateUserInfo: (values: any) => Promise<void>,
  onVert: (code: string) => Promise<boolean | User>,
  removeChangesToUser: () => Promise<void>,
  verifyEmail: () => Promise<void>,
  getUserFromServer: () => Promise<void>,
  locationGranted: boolean | undefined,
  setLocationGranted: Dispatch<SetStateAction<any>>,
  updatePushToken: () => Promise<void>,
}

export const UserContext = createContext<UserContextInterface>({
  setUser: (user: User | null) => null,
  user: null,
  updateState: (field: string, value: any) => null,
  getUserFromStorage: () => null,
  updateUserInfo: async (values: any) => undefined,
  onVert: async (code: string) => false,
  removeChangesToUser: async () => undefined,
  verifyEmail: async () => undefined,
  getUserFromServer: async () => undefined,
  locationGranted: false,
  setLocationGranted: () => undefined,
  updatePushToken: () => undefined,
});

const UserContextProvider = ({ children }: { children: any }) => {
  const usePayments = PaymentsContext.useContainer();
  const [locationGranted, setLocationGranted] = useState();
  const [user, setUser] = useState<User | null>(null);

  const getUserFromServer = () => getUserDetails();

  const updateState = (values: any) => {
    const newUser: User = {
      ...user,
      ...values,
    };
    setUser(newUser);
  };

  const removeChangesToUser = async () => {
    getUserFromStorage();
  };

  const getUserFromStorage = async () => {
    const clientProfile = await StorageService.get(storageKey);
    if (clientProfile) {
      setUser(clientProfile);
    }
  };

  useEffect(() => {
    getUserFromStorage();
    OneSignal.init();
  }, []);

  const updatePushToken = async () => {
    const deviceState = await OneSignal.getDeviceState();
    if (!deviceState) {
      await updateUserInfo({ pushTokenId: null });
      return null;
    }

    if (
      user.pushTokenId !== deviceState.pushToken
      || user.pushUserId !== deviceState.userId
      || user.isPushEnabled !== deviceState.isSubscribed
    ) {
      await updateUserInfo({
        pushTokenId: deviceState.pushToken,
        isPushEnabled: deviceState.isSubscribed,
        pushUserId: deviceState.userId,
      });
    }
    return true;
  };

  const verifyEmail = async () => {
    await sendEmailVerification();
  };

  const updateUserInfo = async (values: any) => {
    updateState(values);
    const newUser = await updateUser(values);
    if (newUser.didCompleteOnboarding) {
      StorageService.save({ [storageKey]: newUser });
    }
  };

  const getCardInfo = () => {
    try {
      const methods = usePayments.paymentMethods;
      if (methods.length) {
        return methods;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onVert = async (code: string) => {
    try {
      const vertResponse = await loginVert({
        phoneNumber: user?.phoneNumber,
        code,
      });

      if (vertResponse.status !== 'OK' || !vertResponse.refreshToken || !vertResponse.accessToken) {
        console.log('Bad vert with response', vertResponse);
        return false;
      }

      auth.updateTokens(vertResponse.refreshToken, vertResponse.accessToken);
      const userProfile = vertResponse.clientProfile || {};
      Mixpanel.setUser(userProfile);

      await Promise.all([
        crashlytics().setUserId(userProfile.id),
        crashlytics().setAttributes({
          demandSourceId: Config.OPERATION_ID,
        }),
      ]);
      const cards = await getCardInfo();
      await updateUserInfo(userProfile);
      return { ...userProfile, cards };
    } catch (e) {
      console.log('Bad vert with request', e);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        setUser: u => setUser(u),
        user,
        updateState,
        getUserFromStorage,
        updateUserInfo,
        onVert,
        removeChangesToUser,
        verifyEmail,
        getUserFromServer,
        locationGranted,
        setLocationGranted,
        updatePushToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


export default UserContextProvider;
