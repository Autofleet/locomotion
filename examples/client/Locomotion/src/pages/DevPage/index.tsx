/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import { RIDE_FINAL_STATES } from '../../lib/commonTypes';
import { MAIN_ROUTES } from '../routes';
import Loader from '../../Components/Loader';
import { isPriceEstimated } from '../../context/newRideContext/utils';
import InformationCard from '../../Components/InformationCard';
import CardRow from '../../Components/CardRow';
import { PageContainer } from '../styles';
import PageHeader from '../../Components/PageHeader';
import { PriceCalculation, RideInterface, RidePageContext } from '../../context/newRideContext';
import i18n from '../../I18n';
import {
  CreditCardRowContainer, PriceItemsContainer, EstimationText, EstimationContainer,
} from './styled';
import { PaymentMethodInterface } from '../../context/payments/interface';
import * as navigationService from '../../services/navigation';
import PriceBreakdown from '../../Components/PriceBreakdown';


const RidePriceBreakDown = () => (
  <PageContainer>
    <PageHeader
      title={i18n.t('devSettingsPage.pageTitle')}
      onIconPress={
          () => navigationService.goBack()}
    />
    <ScrollView />
  </PageContainer>
);

export default RidePriceBreakDown;
