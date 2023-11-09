import React, { useEffect, useState } from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import i18n from '../../I18n';
import {
  getCurrencySymbol,
  getFormattedPrice,
} from '../../context/newRideContext/utils';
import breakdownSkeleton from './breakdownSkeleton';
import RoundedButton from '../RoundedButton';
import {
  Title,
  Row,
  ItemText,
  CenteredItemText,
  Line,
  InnerContainer,
  PriceText,
} from './styled';
import { COUPON_TYPE } from '../../lib/commonTypes';
import PaymentContext from '../../context/payments';

const NoBreakdownComponent = ({
  didRequestFail,
  isLoading,
  retryFunction,
}: any) => {
  if (didRequestFail) {
    return (
      <>
        <CenteredItemText>
          {`${i18n.t('ridePriceBreakdown.errorText')}`}
        </CenteredItemText>
        <RoundedButton
          hollow
          testID="priceBreakdownRetry"
          onPress={retryFunction}
        >
          {`${i18n.t('ridePriceBreakdown.errorButtonText')}`}
        </RoundedButton>
      </>
    );
  }
  return (
    <SkeletonContent
      containerStyle={{}}
      isLoading={isLoading}
      layout={[breakdownSkeleton, breakdownSkeleton, breakdownSkeleton]}
    />
  );
};

interface PriceBreakdownProps {
  priceCalculation: any;
  didRequestFail: boolean;
  retryGetPriceBreakdown: any;
}

const PriceBreakdown = ({
  priceCalculation,
  didRequestFail,
  retryGetPriceBreakdown,
}: PriceBreakdownProps) => {
  const isDebuggingEnabled = typeof atob !== 'undefined';
  const [priceCalculationItems, setPriceCalculationItems] = useState<any[]>();
  const [total, setTotal] = useState<null | string>(null);

  const { showPrice, loadShowPrice } = PaymentContext.useContainer();
  const getPriceWithCurrency = (amount: number) => `${getCurrencySymbol(priceCalculation.currency)}${amount.toFixed(2)}`;

  const calculationTypeToUnit: any = {
    fixed: () => '',
    distance: (price: string) => i18n.t('ridePriceBreakdown.perUnit', {
      unit: priceCalculation?.distanceUnit,
      price,
    }),
    duration: (price: string) => i18n.t('ridePriceBreakdown.perUnit', { unit: 'minute', price }),
  };

  const loadPriceCalculationBreakdown = async () => {
    let totalPrice = 0;
    const items: any[] = [];
    priceCalculation.items.map((item: any) => {
      if (item.price === 0) {
        return;
      }
      totalPrice += item.price;
      let name;
      if (item.pricingRule) {
        const calculationTypeToUnitInstance = calculationTypeToUnit[
          item.pricingRule.calculationType];
        name = `${i18n.t('ridePriceBreakdown.priceItem', {
          name: item.pricingRule.name,
        })} ${calculationTypeToUnitInstance ? calculationTypeToUnitInstance(
          getPriceWithCurrency(item.pricingRule.price),
        ) : ''}`;
      } else if (item.type === COUPON_TYPE) {
        name = item.couponDetails;
      } else if (item.details) {
        name = item.details;
      }
      items.push({
        name:
          name || i18n.t('ridePriceBreakdown.priceFieldNames.cancelationFee'),
        price: getFormattedPrice(priceCalculation.currency, item.price),
      });
    });
    (priceCalculation.additionalCharges || []).map((ac: any) => {
      totalPrice += ac.amount;
      items.push({
        price: getFormattedPrice(priceCalculation.currency, ac.amount),
        name: ac.chargeFor,
      });
    });

    setTotal(getFormattedPrice(priceCalculation.currency, totalPrice));
    setPriceCalculationItems(items);
  };
  useEffect(() => {
    if (priceCalculation) {
      loadPriceCalculationBreakdown();
    }
  }, [priceCalculation]);

  useEffect(() => {
    loadShowPrice();
  }, []);

  return (
    <>
      <InnerContainer>
        <Title>{`${i18n.t('ridePriceBreakdown.pageTitle')}`}</Title>
        {priceCalculationItems ? (
          priceCalculationItems.map(item => (
            <Row>
              <ItemText>{item.name}</ItemText>
              <PriceText>{item.price}</PriceText>
            </Row>
          ))
        ) : (
          <NoBreakdownComponent
            didRequestFail={didRequestFail}
            isLoading={!priceCalculationItems && !isDebuggingEnabled}
            retryFunction={retryGetPriceBreakdown}
          />
        )}
      </InnerContainer>
      {!didRequestFail && (
        <>
          <Line />
          <InnerContainer>
            <Row>
              <ItemText>{`${i18n.t('ridePriceBreakdown.total')}`}</ItemText>
              {priceCalculationItems && showPrice ? (
                <PriceText>{total}</PriceText>
              ) : (
                <SkeletonContent
                  containerStyle={{}}
                  isLoading={!priceCalculationItems && !isDebuggingEnabled}
                  layout={[
                    {
                      width: 50,
                      height: 10,
                    },
                  ]}
                />
              )}
            </Row>
          </InnerContainer>
          <Line />
        </>
      )}
      <InnerContainer />
    </>
  );
};

export default PriceBreakdown;
