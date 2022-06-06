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
import { AUTH_ROUTES, MAIN_ROUTES } from './routes';

export const ROUTES_COMPS = {
  [MAIN_ROUTES.HOME]: ActiveRide,
  [MAIN_ROUTES.RIDE_HISTORY]: RideHistory,
  [MAIN_ROUTES.PAYMENT]: Payments,
  [MAIN_ROUTES.ACCOUNT]: Account,
  [MAIN_ROUTES.CONTACT_US]: ContactUs,
  [MAIN_ROUTES.WEBVIEW]: WebViewPage,
};

export const AUTH_ROUTES_COMPS = {
  [AUTH_ROUTES.START]: StartScreen,
  [AUTH_ROUTES.PHONE]: Phone,
  [AUTH_ROUTES.CODE]: Code,
  [AUTH_ROUTES.NAME]: Name,
  [AUTH_ROUTES.ADD_CARD]: Card,
  [AUTH_ROUTES.AVATAR]: Avatar,
  [AUTH_ROUTES.EMAIL]: Email,
  [AUTH_ROUTES.WELCOME]: Welcome,
  [AUTH_ROUTES.LOCK]: Lock,
};

export const profileStack = ({ stack: Stack }) => (
  <>
    <Stack.Screen name={AUTH_ROUTES.WELCOME} component={AUTH_ROUTES_COMPS[AUTH_ROUTES.WELCOME]} />
    <Stack.Screen name={AUTH_ROUTES.LOCK} component={AUTH_ROUTES_COMPS[AUTH_ROUTES.LOCK]} />
    <Stack.Screen name={AUTH_ROUTES.PHONE} component={AUTH_ROUTES_COMPS[AUTH_ROUTES.PHONE]} />
    <Stack.Screen name={AUTH_ROUTES.CODE} component={AUTH_ROUTES_COMPS[AUTH_ROUTES.CODE]} />
    <Stack.Screen name={AUTH_ROUTES.NAME} component={AUTH_ROUTES_COMPS[AUTH_ROUTES.NAME]} />
    <Stack.Screen name={AUTH_ROUTES.AVATAR} component={AUTH_ROUTES_COMPS[AUTH_ROUTES.AVATAR]} />
    <Stack.Screen name={AUTH_ROUTES.ADD_CARD} component={AUTH_ROUTES_COMPS[AUTH_ROUTES.ADD_CARD]} />
    <Stack.Screen name={AUTH_ROUTES.EMAIL} component={AUTH_ROUTES_COMPS[AUTH_ROUTES.EMAIL]} />
  </>
);
