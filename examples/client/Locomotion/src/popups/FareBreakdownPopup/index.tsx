import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { BackHandler } from 'react-native';
import PriceBreakdown from '../../Components/PriceBreakdown';
import CloseButton from '../../Components/CloseButton';
import ServiceCard from '../../pages/ActiveRide/RideDrawer/RideOptions/ServiceOptions/ServiceCard';
import {
  InnerContainer,
  OuterContainer,
  EstimatedText,
  EstimatedTextContainer,
} from './styled';
import i18n from '../../I18n';
import { Line } from '../../Components/PriceBreakdown/styled';
import { getPriceCalculation } from '../../context/newRideContext/api';
import SettingContext from '../../context/settings';
import PaymentContext from '../../context/payments';
import { RidePageContext } from '../../context/newRideContext';
import showPriceBasedOnAccount from '../../services/showPriceBasedOnAccount';


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
  const [priceCalculation, setPriceCalculation] = useState(null);
  const [didRequestFail, setDidRequestFail] = useState(false);
  const { businessAccountId } = useContext(RidePageContext);
  const { getBusinessAccountById } = PaymentContext.useContainer();
  const { showPrice, loadShowPrice } = SettingContext.useContainer();

  const loadPriceCalculation = async () => {
    try {
      setDidRequestFail(false);
      const response = await getPriceCalculation(service.priceCalculationId);
      setPriceCalculation(response);
    } catch {
      setDidRequestFail(true);
    }
  };
  useEffect(() => {
    loadPriceCalculation();
  }, []);
  useEffect(() => {
    showPriceBasedOnAccount(loadShowPrice, getBusinessAccountById, businessAccountId);
  }, [businessAccountId]);

  return (
    <Modal isVisible={isVisible} onBackButtonPress={onClose}>
      <OuterContainer>
        <InnerContainer>
          <CloseButton onPress={onClose} containerStyles={{ alignSelf: 'flex-end' }} />
          <ServiceCard service={service} />
          {service.isPriceEstimated && showPrice && (
          <EstimatedTextContainer>
            <EstimatedText>
              {`${i18n.t('ridePriceBreakdown.estimatedText')}`}
            </EstimatedText>
          </EstimatedTextContainer>
          )}
        </InnerContainer>
        {service.isPriceEstimated && showPrice && <Line />}
        {showPrice
          && (
          <PriceBreakdown
            priceCalculation={priceCalculation}
            didRequestFail={didRequestFail}
            reloadPriceBreakdown={loadPriceCalculation}
          />
          )}
      </OuterContainer>
    </Modal>
  );
};

export default FareBreakdownPopup;
