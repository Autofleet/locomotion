/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CHARGE_FOR_TIP } from '../../lib/commonTypes';
import NoTitlePriceCard from '../../Components/PriceCard/NoTitlePriceCard';
import { MAIN_ROUTES } from '../routes';
import PriceCard from '../../Components/PriceCard';
import NoTitleCard from '../../Components/NoTitleCard';
import Loader from '../../Components/Loader';
import { getCurrencySymbol, isPriceEstimated } from '../../context/newRideContext/utils';
import InformationCard from '../../Components/InformationCard';
import CardRow from '../../Components/CardRow';
import { PageContainer } from '../styles';
import PageHeader from '../../Components/PageHeader';
import { PriceCalculation, RidePageContext } from '../../context/newRideContext';
import i18n from '../../I18n';
import {
  CreditCardRowContainer, PriceItemsContainer, EstimationText, EstimationContainer,
} from './styled';
import { PaymentMethodInterface } from '../../context/payments/interface';

type RidePriceBreakdownParams = {
  rideId: string,
  rideHistory: boolean
}

type Nav = {
  navigate: (value: string, object?: any) => void;
}

const RidePriceBreakDown = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const params : RidePriceBreakdownParams = route.params as RidePriceBreakdownParams;
  const [loading, setLoading] = useState<boolean>(true);
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodInterface>();
  const {
    ride,
    getRidePriceCalculation,
    getRideFromApi,
  } = useContext(RidePageContext);

  const updatePriceCalculation = async () => {
    setLoading(true);
    const calculation = await getRidePriceCalculation(params.rideId);
    setPriceCalculation(calculation);
    setLoading(false);
  };

  const updateRideFromApi = async () => {
    setLoading(true);
    if (params.rideId || ride.id) {
      // ts does not recognize the null check
      // @ts-ignore
      const result = await getRideFromApi(params.rideId || ride.id);
      setPaymentMethod(result.payment?.paymentMethod);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!priceCalculation || !paymentMethod) {
      setLoading(true);
    }
  }, [priceCalculation, paymentMethod]);

  const getSymbol = () => getCurrencySymbol(priceCalculation?.currency);
  const getPriceWithCurrency = (amount:number) => `${getSymbol()}${amount.toFixed(2)}`;
  const getTip = () => priceCalculation?.additionalCharges?.find(({ chargeFor }) => chargeFor === CHARGE_FOR_TIP);
  const getTotalPrice = () => getPriceWithCurrency(
    (priceCalculation?.totalPrice || 0)
   + (priceCalculation?.additionalCharges?.reduce((s, { amount }) => s + amount, 0) || 0)
    + (priceCalculation?.discount || 0),
  );

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
          () => navigation.navigate(params.rideHistory
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
                (priceCalculation && isPriceEstimated(priceCalculation.calculationBasis))
                  ? (
                    <EstimationContainer>
                      <EstimationText>{i18n.t('ridePriceBreakdown.estimatedText')}</EstimationText>

                    </EstimationContainer>
                  )
                  : null
              }
              </View>
            </InformationCard>

            <InformationCard title={i18n.t('ridePriceBreakdown.paymentBreakdownTitle')}>
              <View>
                {priceCalculation?.surgePrice && priceCalculation?.surgePrice !== 0
                  ? <PriceCard name={i18n.t('ridePriceBreakdown.priceFieldNames.surgePrice')} text={getPriceWithCurrency(priceCalculation?.surgePrice || 0)} />
                  : undefined}
                {priceCalculation?.discount && priceCalculation?.discount !== 0
                  ? <PriceCard name={i18n.t('ridePriceBreakdown.priceFieldNames.discount')} text={`-${getPriceWithCurrency(Math.abs(priceCalculation?.discount) || 0)}`} />
                  : undefined}
                {priceCalculation?.items?.filter(item => item.pricingRule && item.price > 0)
                  .map(item => (
                    <PriceCard
                      name={i18n.t('ridePriceBreakdown.priceItem', {
                        name: item.pricingRule.name,
                        price: getPriceWithCurrency(item.pricingRule.price),
                        unit: priceCalculation.distanceUnit,
                      })}
                      text={getPriceWithCurrency(item.price)}
                    />
                  ))}
                {
                 priceCalculation?.items.find(x => x.cancellationRule) ? (
                   <PriceCard
                     name={i18n.t('ridePriceBreakdown.priceFieldNames.cancelationFee')}
                     text={getPriceWithCurrency(priceCalculation?.totalPrice || 0)}
                   />
                 ) : undefined
                }
              </View>
            </InformationCard>
            {getTip() ? (
              <NoTitleCard>
                <NoTitlePriceCard name={i18n.t('ridePriceBreakdown.priceFieldNames.tip')} text={getPriceWithCurrency((getTip()?.amount || 0))} />
              </NoTitleCard>
            ) : undefined}
            <NoTitleCard>
              <NoTitlePriceCard
                name={i18n.t('ridePriceBreakdown.priceFieldNames.total')}
                text={getTotalPrice()}
              />
            </NoTitleCard>
          </PriceItemsContainer>
        )}
      </ScrollView>
    </PageContainer>
  );
};

export default RidePriceBreakDown;
