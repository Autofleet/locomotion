import React from 'react';
import { storiesOf } from '@storybook/react-native';
import Welcome from './Welcome';

require('./RideDrawer');

storiesOf('Welcome', module).add('to Storybook', () => <Welcome />);
