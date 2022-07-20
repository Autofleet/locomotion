import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Footer } from '../../popups/ChoosePaymentMethod/styled';
import { getCurrencySymbol } from '../../context/newRideContext/utils';
import InformationCard from '../../Components/InformationCard';
import { CardRowContainer } from '../../Components/RidePaymentDetails/styled';
import CardRow from '../../Components/CardRow';
import { Text } from '../Profile/ScreenText/styles';
import { PageContainer } from '../styles';
import PageHeader from '../../Components/PageHeader';
import { RidePageContext } from '../../context/newRideContext';
import i18n from '../../I18n';
import { RideDetailsText } from '../ActiveRide/RideDrawer/styled';

const RidePriceBreakDown = () => {
  const [priceCalculation, setPriceCalculation] = useState<any>();
  const [rideFromApi, setRideFromApi] = useState<any>();
  const {
    ride,
    getRideFromApi,
    getRidePriceCalculation,
  } = useContext(RidePageContext);

  const updateRide = async () => {
    const apiRide = await getRideFromApi(ride.id || '');
    setRideFromApi(apiRide);

    const calculation = await getRidePriceCalculation(rideFromApi.priceCalculationId);
    console.log('calculation', calculation);

    setPriceCalculation(calculation);
  };

  const getSymbol = () => getCurrencySymbol(priceCalculation?.currency);

  useEffect(() => {
    updateRide();
  }, [ride]);
  return (
    <PageContainer>

      <PageHeader
        title={i18n.t('Payment breakdown')}
      />
      <ScrollView>
        <InformationCard title="Paymnet method">
          <View>
            <CardRowContainer style={{
              marginLeft: '25%',
              marginRight: '25%',
              marginTop: 20,
              marginBottom: 20,
              borderColor: '#f1f2f6',
              borderStyle: 'solid',
              borderWidth: 1,
            }}
            >
              <CardRow name={i18n.t('payments.cash')} {...rideFromApi?.payment.paymentMethod} />
            </CardRowContainer>
          </View>
        </InformationCard>
        <InformationCard title="Payment Breakdown">
          <View style={{
            flexDirection: 'column', width: '100%',
          }}
          >
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <Text style={{ width: '80%' }}>Surge Price</Text>
              <Text style={{ textAlign: 'right', width: '30%' }}>
                {priceCalculation?.surgePrice}

                {getSymbol()}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <Text style={{ width: '80%' }}>Discount</Text>
              <Text style={{ textAlign: 'right', width: '30%' }}>
                {priceCalculation?.discount}
                {getSymbol()}
              </Text>
            </View>
            <View style={{ flexDirection: 'column' }}>
              {priceCalculation?.items?.map(item => (
                <View style={{ flexDirection: 'row', width: '100%' }}>
                  <Text>{`${item.pricingRule.name} `}</Text>
                  <Text style={{ fontSize: 10, marginTop: 13 }}>
                    {item.pricingRule.price}
                    {getSymbol()}
                    {item.pricingRule.calculationType === 'distance' ? ' per KM ' : ' per min ' }

                  </Text>
                  <Text style={{ textAlign: 'right', width: '82%', left: 0 }}>
                    {` ${item.price}${getSymbol()}`}
                  </Text>
                </View>
              ))}
            </View>

          </View>
        </InformationCard>
        <View style={{
          flexDirection: 'row', width: '95%', bottom: 0, marginHorizontal: 5,
        }}
        >
          <Text style={{ flex: 7, marginLeft: 5 }}>Total</Text>
          <Text style={{ textAlign: 'right', flex: 2 }}>{`${priceCalculation?.basePrice}${getSymbol()}`}</Text>
        </View>
      </ScrollView>
    </PageContainer>
  );
};

export default RidePriceBreakDown;
