import React, { Fragment } from 'react';
import { View } from 'react-native';

import moment from 'moment';
import i18n from '../../../../I18n';

import { FutureOrder, FutureText } from './styled';

export default ({
  futureRides, isOpen, onPress,
}) => (
  <FutureOrder onPress={onPress}>
    <FutureText>
      {isOpen
        ? i18n.t('home.futureRides.closeButton')
        : i18n.t('home.futureRides.openBookingsButton', { openBookings: futureRides ? futureRides.length : 0 })
      }
    </FutureText>
  </FutureOrder>
);
