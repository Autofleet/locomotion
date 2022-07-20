import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
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

const RidePriceBreakDown = () => {
  const route = useRoute();
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
    const calculation = await getRidePriceCalculation();
    setPriceCalculation(calculation);
    setLoading(false);
  };

  const updateRideFromApi = async () => {
    setLoading(true);
    const result = await getRideFromApi(ride.id || '');
    setPaymentMethod(result.payment?.paymentMethod);
    setLoading(false);
  };

  const getSymbol = () => getCurrencySymbol(priceCalculation?.currency);
  const getPriceWithCurrency = (amount:number) => `${amount}${getSymbol()}`;
  const getTip = () => priceCalculation?.additionalCharges?.find(({ chargeFor }) => chargeFor === 'tip');

  useEffect(() => {
    updatePriceCalculation();
  }, [ride.paymentMethodId]);

  useEffect(() => {
    updateRideFromApi();
  }, [ride.paymentMethodId]);
  return (
    <PageContainer>

      <PageHeader
        title={i18n.t('Payment breakdown')}
      />
      <ScrollView>
        {loading ? (
          <Loader />
        ) : (
          <>
            <InformationCard title="Paymnet method">
              <View>
                <CreditCardRowContainer>
                  <CardRow {...paymentMethod} />
                </CreditCardRowContainer>
              </View>
            </InformationCard>
            <InformationCard title="Payment Breakdown">
              <View style={{ flexDirection: 'column' }}>
                {priceCalculation?.surgePrice !== 0 ? <PriceCard name="Surge Price" text={getPriceWithCurrency(priceCalculation?.surgePrice || 0)} /> : undefined}
                {priceCalculation?.discount !== 0 ? <PriceCard name="Discount" text={getPriceWithCurrency(priceCalculation?.discount || 0)} /> : undefined}
                {priceCalculation?.items?.map(item => (
                  <PriceCard
                    name={`${item.pricingRule.name} - ${getPriceWithCurrency(item.pricingRule.price)} ${item.pricingRule.calculationType === 'distance' ? 'per KM ' : 'per min '}`}
                    text={getPriceWithCurrency(item.price)}
                  />
                ))}
              </View>
            </InformationCard>
            {getTip() ? (
              <NoTitleCard>
                <PriceCard name="Tip" text={getPriceWithCurrency((getTip()?.amount || 0))} />
              </NoTitleCard>
            ) : undefined}
            <NoTitleCard>
              <PriceCard
                name="Total"
                text={getPriceWithCurrency((priceCalculation?.totalPrice || 0)
                   + (getTip()?.amount || 0))}
              />
            </NoTitleCard>
          </>
        )}
      </ScrollView>
    </PageContainer>
  );
};

export default RidePriceBreakDown;
