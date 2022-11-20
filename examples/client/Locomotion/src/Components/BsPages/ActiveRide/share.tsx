import React, { useState, useContext } from 'react';
import { Share } from 'react-native';
import Mixpanel from '../../../services/Mixpanel';
import {
  ButtonContainer, HALF_WIDTH,
} from './styled';
import i18n from '../../../I18n';
import Loader from '../../Loader';
import { RidePageContext } from '../../../context/newRideContext';
import share from '../../../assets/bottomSheet/share.svg';
import GenericRideButton from '../../GenericRideButton';

const ShareButton = () => {
  const { trackRide, ride } = useContext(RidePageContext);
  const [isLoading, setIsLoading] = useState(false);

  const onShare = async () => {
    try {
      Mixpanel.setEvent('Sharing ride');
      setIsLoading(true);
      const trackerUrl = await trackRide();
      setIsLoading(false);
      await Share.share({
        message: trackerUrl,
        url: trackerUrl,
      });
    } catch (e) {
      Mixpanel.setEvent('failed to share ride');
    }
  };

  return (
    <ButtonContainer
      onPress={() => {
        onShare();
      }}
    >
      {
            isLoading
              ? (
                <Loader
                  lottieViewStyle={{
                    height: 15, width: 15, alignSelf: 'center',
                  }}
                  dark
                  sourceProp={undefined}
                />
              )
              : (
                <GenericRideButton
                  icon={share}
                  title={i18n.t('bottomSheetContent.ride.shareRide')}
                />
              )
        }
    </ButtonContainer>
  );
};

export default ShareButton;
