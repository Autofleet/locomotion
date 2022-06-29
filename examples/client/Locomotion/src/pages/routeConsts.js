import React from 'react';
import StartScreen from './AuthScreens/StartScreen';
import Phone from './Profile/Phone';
import Code from './Profile/Code';
import Name from './Profile/Name';
import Card from './Profile/Card';
import Avatar from './Profile/Avatar';
import Email from './Profile/Email';
import Welcome from './Profile/Welcome';
import Lock from './Lock';
import Logout from './Logout';
import WebViewPage from './WebViewPage';
import ActiveRide from './ActiveRide';
import ContactUs from './ContactUs';
import Account from './Account';
import Payments from './Payments';
import CompletedRideOverviewPage from './RideHistory/CompletedRideOverviewPage';
import RideHistory from './RideHistory';
import PostRide from './PostRide';
import { MAIN_ROUTES } from './routes';

export const ROUTES_COMPS = {
  [MAIN_ROUTES.HOME]: ActiveRide,
  [MAIN_ROUTES.COMPLETED_RIDE_OVERVIEW_PAGE]: CompletedRideOverviewPage,
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
  [MAIN_ROUTES.POST_RIDE]: PostRide,
  [MAIN_ROUTES.LOGOUT]: Logout,
};

export const profileStack = ({ stack: Stack }) => (
  <>
    <Stack.Screen name={MAIN_ROUTES.WELCOME} component={ROUTES_COMPS[MAIN_ROUTES.WELCOME]} />
    <Stack.Screen name={MAIN_ROUTES.LOCK} component={ROUTES_COMPS[MAIN_ROUTES.LOCK]} />
    <Stack.Screen name={MAIN_ROUTES.PHONE} component={ROUTES_COMPS[MAIN_ROUTES.PHONE]} />
    <Stack.Screen name={MAIN_ROUTES.CODE} component={ROUTES_COMPS[MAIN_ROUTES.CODE]} />
    <Stack.Screen name={MAIN_ROUTES.NAME} component={ROUTES_COMPS[MAIN_ROUTES.NAME]} />
    <Stack.Screen name={MAIN_ROUTES.AVATAR} component={ROUTES_COMPS[MAIN_ROUTES.AVATAR]} />
    <Stack.Screen name={MAIN_ROUTES.ADD_CARD} component={ROUTES_COMPS[MAIN_ROUTES.ADD_CARD]} />
    <Stack.Screen name={MAIN_ROUTES.EMAIL} component={ROUTES_COMPS[MAIN_ROUTES.EMAIL]} />
  </>
);
