import React, {
  createContext, Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import crashlytics from '@react-native-firebase/crashlytics';
import Config from 'react-native-config';
import AppSettings from '../../services/app-settings';
import { authService, StorageService } from '../../services';
import {
  getUserDetails, loginVert, sendEmailVerification,
  updateUser as updateUserApi, emailVerify, deleteUser as deleteUserApi, getUserCoupon, createUserCoupon, loginApi,
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
  didCompleteOnboarding?: boolean;
}

interface UserContextInterface {
  setUser: (user: User | null) => void,
  user: User | null,
  updateState: (field: string, value: any) => void,
  getUserFromStorage: () => void,
  updateUserInfo: (values: any) => Promise<void>,
  onVert: (code: string) => Promise<boolean | User>,
  onEmailVert: (code: string) => Promise<boolean>,
  updateUserFromServer: () => Promise<void>,
  removeChangesToUser: () => Promise<void>,
  verifyEmail: () => Promise<void>,
  getUserFromServer: () => Promise<void>,
  locationGranted: boolean | undefined,
  setLocationGranted: Dispatch<SetStateAction<any>>,
  updatePushToken: () => Promise<boolean | null>,
  deleteUser: () => Promise<boolean>,
  updateUser: (values: any) => Promise<any>,
  coupon: any | null,
  getCoupon: () => Promise<any>,
  createCoupon: (values: any) => Promise<any>,
  setCoupon: (coupon: any | null) => void,
  onLogin: (phoneNumber: string, channel: string) => Promise<void>
}

export const UserContext = createContext<UserContextInterface>({
  setUser: (user: User | null) => null,
  user: null,
  updateState: (field: string, value: any) => null,
  getUserFromStorage: () => null,
  updateUserInfo: async (values: any) => undefined,
  onVert: async (code: string) => false,
  onEmailVert: async (code: string) => false,
  updateUserFromServer: async () => undefined,
  removeChangesToUser: async () => undefined,
  verifyEmail: async () => undefined,
  getUserFromServer: async () => undefined,
  locationGranted: false,
  setLocationGranted: () => undefined,
  updatePushToken: async () => false,
  deleteUser: async () => true,
  updateUser: async (values: any) => undefined,
  coupon: null,
  getCoupon: async () => undefined,
  setCoupon: (coupon: any | null) => null,
  createCoupon: async (values: any) => undefined,
  onLogin: async (phoneNumber: string, channel: string) => undefined,
});

const UserContextProvider = ({ children }: { children: any }) => {
  const usePayments = PaymentsContext.useContainer();
  const [locationGranted, setLocationGranted] = useState();
  const [user, setUser] = useState<User | null>(null);
  const [coupon, setCoupon] = useState<any | null>(null);

  const getUserFromServer = () => getUserDetails();

  const updateUserFromServer = async () => {
    try {
      const userFromServer = await getUserDetails();
      setUser(userFromServer);
    } catch (e) {
      authService.logout();
    }
  };

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
  }, []);

  const updatePushToken = async () => {
    const deviceState = await OneSignal.getDeviceState();
    if (!deviceState) {
      await updateUserInfo({ pushTokenId: null });
      return null;
    }

    if (
      user?.pushTokenId !== deviceState.pushToken
      || user?.pushUserId !== deviceState.userId
      || user?.isPushEnabled !== deviceState.isSubscribed
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

  const updateUserInfo = async (values: any, { updateServer = true } = {}) => {
    updateState(values);
    const newUser = updateServer ? await updateUserApi(values) : values;
    if (newUser.didCompleteOnboarding) {
      StorageService.save({ [storageKey]: newUser });
    }
  };

  const updateUser = async (values: any): Promise<any> => updateUserApi(values);

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

  const onEmailVert = async (code: string) => {
    const vertResponse = await emailVerify({
      email: user?.email,
      code,
    });

    return vertResponse.status === 'OK';
  };

  const getAllowedDemandSourceIds = () => {
    if (!Config.ALLOWED_DEMAND_SOURCE_IDS) {
      return [];
    }
    const allowedDemandSourceIds = JSON.parse(Config.ALLOWED_DEMAND_SOURCE_IDS);
    return Array.isArray(allowedDemandSourceIds) ? allowedDemandSourceIds : [];
  }

  const onLogin = async (phoneNumber: string, channel = 'sms') => {
    const demandSourceId = await AppSettings.getOperationId();
    const allowedDemandSourceIds = getAllowedDemandSourceIds();
    const response = await loginApi({
      phoneNumber,
      channel,
      demandSourceId,
      allowedDemandSourceIds,
    });
    const { selectedDemandSourceId } = response;
    if (allowedDemandSourceIds.length > 0 && selectedDemandSourceId && selectedDemandSourceId !== demandSourceId) {
      await AppSettings.setOperationId(selectedDemandSourceId);
    }
    // successful login - delete captcha token
    await StorageService.delete('captchaToken');
  };

  const onVert = async (code: string) => {
    const demandSourceId = await AppSettings.getOperationId();
    try {
      const vertResponse = await loginVert({
        phoneNumber: user?.phoneNumber,
        code,
        demandSourceId,
      });

      if (vertResponse.status !== 'OK' || !vertResponse.refreshToken || !vertResponse.accessToken) {
        console.log('Bad vert with response', vertResponse);
        return false;
      }
      await auth.updateTokens(vertResponse.refreshToken, vertResponse.accessToken);

      const userProfile = vertResponse.clientProfile || {};
      Mixpanel.setUser(userProfile);
      await Promise.all([
        crashlytics().setUserId(userProfile.id),
        crashlytics().setAttributes({
          demandSourceId,
        }),
      ]);
      const cards = await getCardInfo();
      await updateUserInfo(userProfile, { updateServer: false });
      return { ...userProfile, cards };
    } catch (e) {
      console.log('Bad vert with request', e);
      return false;
    }
  };

  useEffect(() => {
    if (user?.id && user?.didCompleteOnboarding) {
      OneSignal.init();
      updatePushToken();
    }
  }, [user?.id, user?.didCompleteOnboarding]);

  const deleteUser = async () => {
    const result = await deleteUserApi();
    return result;
  };

  const getCoupon = async () => {
    const result = await getUserCoupon();
    return result;
  };

  const createCoupon = async (code: string) => {
    const result = await createUserCoupon(code);
    return result;
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
        onEmailVert,
        updateUserFromServer,
        removeChangesToUser,
        verifyEmail,
        getUserFromServer,
        locationGranted,
        setLocationGranted,
        updatePushToken,
        deleteUser,
        updateUser,
        coupon,
        getCoupon,
        setCoupon: c => setCoupon(c),
        createCoupon,
        onLogin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


export default UserContextProvider;
