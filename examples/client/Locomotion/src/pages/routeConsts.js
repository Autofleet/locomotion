import React from 'react';
import StartScreen from './AuthScreens/StartScreen';
import Phone from './AuthScreens/Onboarding/Phone';
import Code from './AuthScreens/Onboarding/Code';
import Name from './AuthScreens/Onboarding/Name';
import Card from './AuthScreens/Onboarding/Card';
import Avatar from './AuthScreens/Onboarding/Avatar';
import Email from './AuthScreens/Onboarding/Email';
import Welcome from './AuthScreens/Onboarding/Welcome';
import Lock from './Lock';
import WebViewPage from './WebViewPage';
import ActiveRide from './ActiveRide';
import ContactUs from './ContactUs';
import Account from './Account';
import Payments from './Payments';
import RideHistory from './RideHistory';
import {MAIN_ROUTES} from './routes';

export const ROUTES_COMPS = {
  [MAIN_ROUTES.HOME]: ActiveRide,
  [MAIN_ROUTES.RIDE_HISTORY]: RideHistory,
  [MAIN_ROUTES.PAYMENT]: Payments,
  [MAIN_ROUTES.ACCOUNT]: Account,
  [MAIN_ROUTES.CONTACT_US]: ContactUs,
  [MAIN_ROUTES.WEBVIEW]: WebViewPage,
  [MAIN_ROUTES.START]: StartScreen,
  [MAIN_ROUTES.PHONE]: Phone,
  [MAIN_ROUTES.CODE]: Code,
  [MAIN_ROUTES.NAME]: Name,
  [MAIN_ROUTES.ADD_CARD]: Card,
  [MAIN_ROUTES.AVATAR]: Avatar,
  [MAIN_ROUTES.EMAIL]: Email,
  [MAIN_ROUTES.WELCOME]: Welcome,
  [MAIN_ROUTES.LOCK]: Lock,
};

export const profileStack = ({stack: Stack}) => (
  <>
    <Stack.Screen
      name={MAIN_ROUTES.WELCOME}
      component={ROUTES_COMPS[MAIN_ROUTES.WELCOME]}
    />
    <Stack.Screen
      name={MAIN_ROUTES.LOCK}
      component={ROUTES_COMPS[MAIN_ROUTES.LOCK]}
    />
    <Stack.Screen
      name={MAIN_ROUTES.PHONE}
      component={ROUTES_COMPS[MAIN_ROUTES.PHONE]}
    />
    <Stack.Screen
      name={MAIN_ROUTES.CODE}
      component={ROUTES_COMPS[MAIN_ROUTES.CODE]}
    />
    <Stack.Screen
      name={MAIN_ROUTES.NAME}
      component={ROUTES_COMPS[MAIN_ROUTES.NAME]}
    />
    <Stack.Screen
      name={MAIN_ROUTES.AVATAR}
      component={ROUTES_COMPS[MAIN_ROUTES.AVATAR]}
    />
    <Stack.Screen
      name={MAIN_ROUTES.ADD_CARD}
      component={ROUTES_COMPS[MAIN_ROUTES.ADD_CARD]}
    />
    <Stack.Screen
      name={MAIN_ROUTES.EMAIL}
      component={ROUTES_COMPS[MAIN_ROUTES.EMAIL]}
    />
  </>
);
