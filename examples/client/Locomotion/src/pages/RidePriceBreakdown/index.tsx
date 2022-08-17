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

type RidePriceBreakdownParams = {
  rideId: string,
  rideHistory: boolean
}

const RidePriceBreakDown = () => {
  const route = useRoute();
  const params : RidePriceBreakdownParams = route.params as RidePriceBreakdownParams;
  const [loading, setLoading] = useState<boolean>(true);
  const [didRequestFail, setDidRequestFail] = useState(false);
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodInterface>();
  const [localRide, setLocalRide] = useState<RideInterface>();
  const {
    ride,
    getRidePriceCalculation,
    getRideFromApi,
  } = useContext(RidePageContext);

  const updatePriceCalculation = async () => {
    try {
      setDidRequestFail(false);
      const calculation = await getRidePriceCalculation(params.rideId);
      setPriceCalculation(calculation);
    } catch {
      setDidRequestFail(false);
    }
  };

  const updateRideFromApi = async () => {
    setLoading(true);
    if (params.rideId || ride.id) {
      // ts does not recognize the null check
      // @ts-ignore
      const result = await getRideFromApi(params.rideId || ride.id);
      setLocalRide(result);
      setPaymentMethod(result.payment.paymentMethod);

      setLoading(false);
    }
  };

  useEffect(() => {
    if (!paymentMethod) {
      setLoading(true);
    }
  }, [paymentMethod]);

  useEffect(() => {
    updatePriceCalculation();
  }, []);

  useEffect(() => {
    updateRideFromApi();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title={i18n.t('ridePriceBreakdown.pageTitle')}
        onIconPress={
          () => navigationService.navigate(params.rideHistory
            ? MAIN_ROUTES.COMPLETED_RIDE_OVERVIEW_PAGE
            : MAIN_ROUTES.HOME)}
      />
      <ScrollView>
        {loading ? (
          <Loader lottieViewStyle={undefined} sourceProp={undefined} />
        ) : (
          <PriceItemsContainer>
            <InformationCard title={i18n.t('ridePriceBreakdown.paymentMethodTitle')}>
              <View>
                <CreditCardRowContainer>
                  <CardRow {...paymentMethod} />
                </CreditCardRowContainer>
                {
                (priceCalculation && isPriceEstimated(priceCalculation.calculationBasis)
                                  && !RIDE_FINAL_STATES.includes(localRide?.state || ''))
                  ? (
                    <EstimationContainer>
                      <EstimationText>{i18n.t('ridePriceBreakdown.estimatedText')}</EstimationText>

                    </EstimationContainer>
                  )
                  : null
              }
              </View>
            </InformationCard>

            <PriceBreakdown
              priceCalculation={priceCalculation}
              didRequestFail={didRequestFail}
              retryGetPriceBreakdown={updatePriceCalculation}
            />
          </PriceItemsContainer>
        )}
      </ScrollView>
    </PageContainer>
  );
};

export default RidePriceBreakDown;
