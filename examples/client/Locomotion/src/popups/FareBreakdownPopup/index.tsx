import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import CloseButton from '../../Components/CloseButton';
import { getFormattedPrice } from '../../context/newRideContext/utils';
import ServiceCard from '../../pages/ActiveRide/RideDrawer/RideOptions/ServiceOptions/ServiceCard';
import {
  InnerContainer,
  OuterContainer,
  EstimatedText,
  EstimatedTextContainer,
  Line,
  Title,
  Row,
  ItemText,
} from './styled';
import i18n from '../../I18n';
import { getPriceCalculation } from '../../context/newRideContext/api';
import breakdownSkeleton from './breakdownSkeleton';
import RoundedButton from '../../Components/RoundedButton';

const NoBreakdownComponent = ({ failedRequest, isLoading, retryFunction }: any) => {
  if (failedRequest) {
    return (
      <>
        <ItemText style={{ textAlign: 'center', margin: 10 }}>
          {`${i18n.t('ridePriceBreakdown.errorText')}`}
        </ItemText>
        <RoundedButton hollow testID="priceBreakdownRetry" onPress={retryFunction}>
          {`${i18n.t('ridePriceBreakdown.errorButtonText')}`}
        </RoundedButton>
      </>
    );
  }
  return (
    <SkeletonContent
      containerStyle={{}}
      isLoading={isLoading}
      layout={[
        breakdownSkeleton,
        breakdownSkeleton,
        breakdownSkeleton,
      ]}
    />
  );
};

interface FareBreakdownPopupProps {
  isVisible: boolean;
  service: any;
  onClose: any;
}

const FareBreakdownPopup = ({
  isVisible,
  service,
  onClose,
}: FareBreakdownPopupProps) => {
  const isDebuggingEnabled = (typeof atob !== 'undefined');
  const [failedRequest, setFailedRequest] = useState(false);
  const [priceCalculationItems, setPriceCalculationItems] = useState<any[]>();
  const [total, setTotal] = useState('');
  const getBreakdown = async () => {
    try {
      setFailedRequest(false);
      const response = await getPriceCalculation(service.priceCalculationId);
      let totalPrice = 0;
      const items = response.items.map((item: any) => {
        totalPrice += item.price;
        return {
          name: item.pricingRule.name,
          price: getFormattedPrice(response.currency, item.price),
        };
      });
      setTotal(getFormattedPrice(response.currency, totalPrice));
      setPriceCalculationItems(items);
    } catch (e) {
      setFailedRequest(true);
    }
  };
  useEffect(() => {
    if (service.priceCalculationId) {
      getBreakdown();
    }
  }, []);


  return (
    <Modal isVisible={isVisible}>
      <OuterContainer>
        <InnerContainer>
          <CloseButton onPress={onClose} containerStyles={{ alignSelf: 'flex-end', marginBottom: 5 }} />
          <ServiceCard service={service} inPopup />
          {service.isPriceEstimated && (
          <EstimatedTextContainer>
            <EstimatedText>
              {`${i18n.t('ridePriceBreakdown.estimatedText')}`}
            </EstimatedText>
          </EstimatedTextContainer>
          )}
        </InnerContainer>
        {service.isPriceEstimated && <Line />}
        <InnerContainer>
          <Title>
            {`${i18n.t('ridePriceBreakdown.pageTitle')}`}
          </Title>
          {priceCalculationItems ? priceCalculationItems.map(item => (
            <Row>
              <ItemText>
                {item.name}
              </ItemText>
              <ItemText>
                {item.price}
              </ItemText>
            </Row>
          ))
            : (
              <NoBreakdownComponent
                failedRequest={failedRequest}
                isLoading={!priceCalculationItems && !isDebuggingEnabled}
                retryFunction={getBreakdown}
              />
            )}
        </InnerContainer>
        {!failedRequest
        && (
          <>
            <Line />
            <InnerContainer>
              <Row>
                <ItemText>
                  {`${i18n.t('ridePriceBreakdown.total')}`}
                </ItemText>
                {priceCalculationItems ? (
                  <ItemText>
                    {total}
                  </ItemText>
                )
                  : (
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
      </OuterContainer>
    </Modal>
  );
};

export default FareBreakdownPopup;
