import React from 'react';
import moment from 'moment';
import { storiesOf } from '@storybook/react-native';
import CenterView from './CenterView';
import RideDrawer from '../../src/pages/ActiveRide/RideDrawer';

const rideState = {
  activeRide: {
    status: 'active',
    stop_points: [
      {
        description: 'Arlozorov 138-152, Tel Aviv-Yafo', eta: moment().add(5, 'minutes').format(), arrived_at: moment(), completed_at: moment(),
      },
      { description: 'Rashi 26-34, Tel Aviv-Yafo', eta: moment().add(15, 'minutes').format() },
    ],
    driver: {
      first_name: 'Guy',
      last_name: 'Serfaty',
      avatar: 'https://res.cloudinary.com/autofleet/image/upload/v1562246876/df32qhvtcl7ge0jlwwty.jpg',
    },
    vehicle: {
      model: 'Kia Sportage',
      color: 'Green',
      license_number: '00000007',
      image: 'https://res.cloudinary.com/autofleet/image/upload/v1535368744/Control-Center/green.png',
    },
  },
  openLocationSelect: () => null,
  requestStopPoints: {},
  cancelRide: () => null,
  createRide: () => null,
};


storiesOf('RideDrawer', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('Before ride', () => (
    <RideDrawer
      activeRide={null}
      openLocationSelect={() => null}
      requestStopPoints={{}}
      cancelRide={() => null}
      createRide={() => null}
      // readyToBook
    />
  ))
  .add('Book is ready', () => (
    <RideDrawer
      activeRide={null}
      openLocationSelect={() => null}
      requestStopPoints={{ pickup: { description: 'Arlozorov 138-152, Tel Aviv-Yafo' }, dropoff: { description: 'Rashi 26-34, Tel Aviv-Yafo' } }}
      cancelRide={() => null}
      createRide={() => null}
      readyToBook
    />
  ))
  .add('Before passenger on board', () => (
    <RideDrawer
      {...rideState}
      activeRide={{
        ...rideState.activeRide,
        stop_points: [
          { description: 'Arlozorov 138-152, Tel Aviv-Yafo', eta: moment().add(5, 'minutes').format() },
          { description: 'Rashi 26-34, Tel Aviv-Yafo', eta: moment().add(15, 'minutes').format() },
        ],
      }}
    />
  ))
  .add('Driver arrived', () => (
    <RideDrawer
      {...rideState}
      activeRide={{
        ...rideState.activeRide,
        stop_points: [
          { description: 'Arlozorov 138-152, Tel Aviv-Yafo', eta: moment().add(5, 'minutes').format(), arrived_at: moment() },
          { description: 'Rashi 26-34, Tel Aviv-Yafo', eta: moment().add(15, 'minutes').format() },
        ],
      }}
    />
  ))
  .add('Passenger on board', () => (
    <RideDrawer
      {...rideState}
      activeRide={{
        ...rideState.activeRide,
        stop_points: [
          {
            description: 'Arlozorov 138-152, Tel Aviv-Yafo', eta: moment().add(5, 'minutes').format(), arrived_at: moment(), completed_at: moment(),
          },
          { description: 'Rashi 26-34, Tel Aviv-Yafo', eta: moment().add(15, 'minutes').format() },
        ],
      }}
    />
  ));
