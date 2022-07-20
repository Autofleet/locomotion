import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import NoTitlePriceCard from '../../Components/PriceCard/NoTitlePriceCard';
import { MAIN_ROUTES } from '../routes';
import PriceCard from '../../Components/PriceCard';
import NoTitleCard from '../../Components/NoTitleCard';
import Loader from '../../Components/Loader';
import { getCurrencySymbol } from '../../context/newRideContext/utils';
import InformationCard from '../../Components/InformationCard';
import CardRow from '../../Components/CardRow';
import { PageContainer } from '../styles';
import PageHeader from '../../Components/PageHeader';
import { PriceCalculation, RidePageContext } from '../../context/newRideContext';
import i18n from '../../I18n';
import { CreditCardRowContainer } from './styled';
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
    const result = await getRideFromApi(params.rideId || ride.id || '');
    setPaymentMethod(result.payment?.paymentMethod);
    setLoading(false);
  };

  const getSymbol = () => getCurrencySymbol(priceCalculation?.currency);
  const getPriceWithCurrency = (amount:number) => `${getSymbol()}${amount.toFixed(2)}`;
  const getTip = () => priceCalculation?.additionalCharges?.find(({ chargeFor }) => chargeFor === 'tip');
  const getTotalPrice = () => getPriceWithCurrency(
    (priceCalculation?.totalPrice || 0)
   + (priceCalculation?.additionalCharges?.reduce((s, { amount }) => s + amount, 0) || 0)
    + (priceCalculation?.discount || 0),
  );

  const calculationTypeToUnit = {
    fixed: '',
    duration: 'min',
    distance: priceCalculation?.distanceUnit,
  };

  useEffect(() => {
    updatePriceCalculation();
  }, []);

  useEffect(() => {
    updateRideFromApi();
  }, []);
  return (
    <PageContainer>

      <PageHeader
        title={i18n.t('Payment breakdown')}
        onIconPress={
          () => navigation.navigate(params.rideHistory
            ? MAIN_ROUTES.COMPLETED_RIDE_OVERVIEW_PAGE
            : MAIN_ROUTES.HOME)}
      />
      <ScrollView>
        {loading ? (
          <Loader />
        ) : (
          <View style={{ width: '90%', marginLeft: 15 }}>
            <View>
              <InformationCard title="Paymnet method">
                <View>
                  <CreditCardRowContainer>
                    <CardRow {...paymentMethod} />
                  </CreditCardRowContainer>
                </View>
              </InformationCard>
            </View>

            <InformationCard title="Payment Breakdown">
              <View style={{
                flexDirection: 'column',
              }}
              >
                {priceCalculation?.surgePrice && priceCalculation?.surgePrice !== 0
                  ? <PriceCard name="Surge Price" text={getPriceWithCurrency(priceCalculation?.surgePrice || 0)} />
                  : undefined}
                {priceCalculation?.discount && priceCalculation?.discount !== 0
                  ? <PriceCard name="Discount" text={getPriceWithCurrency(priceCalculation?.discount || 0)} />
                  : undefined}
                {priceCalculation?.items?.map(item => (
                  <PriceCard
                    name={`${item.pricingRule.name} - ${getPriceWithCurrency(item.pricingRule.price)} per ${calculationTypeToUnit[item.pricingRule.calculationType]}`}
                    text={getPriceWithCurrency(item.price)}
                  />
                ))}
              </View>
            </InformationCard>
            {getTip() ? (
              <NoTitleCard>
                <NoTitlePriceCard name="Tip" text={getPriceWithCurrency((getTip()?.amount || 0))} />
              </NoTitleCard>
            ) : undefined}
            <NoTitleCard>
              <NoTitlePriceCard
                name="Total"
                text={getTotalPrice()}
              />
            </NoTitleCard>
          </View>
        )}
      </ScrollView>
    </PageContainer>
  );
};

export default RidePriceBreakDown;
