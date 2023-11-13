import React, { useEffect, useState } from 'react';
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
import SettingsContext from '../../context/settings';
import SETTINGS_KEYS from '../../context/settings/keys';


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
  const [showPrice, setShowPrice] = useState<boolean>(true);

  const { getSettingByKey } = SettingsContext.useContainer();

  const loadPriceCalculation = async () => {
    try {
      setDidRequestFail(false);
      const response = await getPriceCalculation(service.priceCalculationId);
      setPriceCalculation(response);
    } catch {
      setDidRequestFail(true);
    }
  };

  const loadShowPrice = async () => {
    const hidePrice = await getSettingByKey(
      SETTINGS_KEYS.HIDE_PRICE,
    );
    setShowPrice(!hidePrice);
  };

  useEffect(() => {
    loadPriceCalculation();
    loadShowPrice();
  }, []);

  return (
    <Modal isVisible={isVisible} onBackButtonPress={onClose}>
      <OuterContainer>
        <InnerContainer>
          <CloseButton onPress={onClose} containerStyles={{ alignSelf: 'flex-end' }} />
          <ServiceCard service={service} />
          {service.isPriceEstimated && (
          <EstimatedTextContainer>
            <EstimatedText>
              {`${i18n.t('ridePriceBreakdown.estimatedText')}`}
            </EstimatedText>
          </EstimatedTextContainer>
          )}
        </InnerContainer>
        {service.isPriceEstimated && <Line />}
        {showPrice
          && (
          <PriceBreakdown
            priceCalculation={priceCalculation}
            didRequestFail={didRequestFail}
            retryGetPriceBreakdown={loadPriceCalculation}
          />
          )}
      </OuterContainer>
    </Modal>
  );
};

export default FareBreakdownPopup;
