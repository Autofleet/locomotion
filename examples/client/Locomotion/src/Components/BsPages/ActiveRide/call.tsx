import React, { useState, useContext } from 'react';
import { Alert } from 'react-native';
import propsTypes from 'prop-types';
import Mixpanel from '../../../services/Mixpanel';
import Loader from '../../Loader';
import DeviceService from '../../../services/device';

import i18n from '../../../I18n';
import { ButtonContainer } from './styled';
import GenericRideButton from '../../GenericRideButton';
import phone from '../../../assets/bottomSheet/phone.svg';
import { RidePageContext } from '../../../context/newRideContext';

const CallContactPersonMasked = ({ onError }: { onError: any}) => {
  const { getCallNumbers } = useContext(RidePageContext);
  const [disabledPhoneButton, setDisabledPhoneButton] = useState(false);

  const ActionMenu = (number: any) => {
    const callPhone = (phoneNumber: any) => {
      Mixpanel.clickEvent('Call contact person');
      DeviceService.call(phoneNumber);
    };

    const smsPhone = (phoneNumber: any) => {
      Mixpanel.clickEvent('SMS contact person');
      DeviceService.sms(phoneNumber, '');
    };

    const options = [i18n.t('bottomSheetContent.ride.phoneCallOptions.call'), i18n.t('bottomSheetContent.ride.phoneCallOptions.sms')];
    // Use the cross-platform Alert.alert on iOS too. The native ActionSheetIOS
    // (a void TurboModule) throws on a background queue under the New Architecture,
    // crashing the app (AF-9397) in a way the surrounding try/catch can't catch.
    Alert.alert(
      i18n.t('bottomSheetContent.ride.contactDriver'),
      undefined,
      [
        { text: options[0], onPress: () => callPhone(number) },
        { text: options[1], onPress: () => smsPhone(number) },
        { text: i18n.t('bottomSheetContent.ride.phoneCallOptions.cancel'), style: 'cancel' },
      ],
    );
  };

  return (
    <ButtonContainer
      disabled={disabledPhoneButton}
      onPress={async () => {
        setDisabledPhoneButton(true);
        try {
          const number = await getCallNumbers();
          ActionMenu(number);
        } catch (e) {
          Mixpanel.setEvent('Call contact person Error');
          onError();
        } finally {
          setDisabledPhoneButton(false);
        }
      }}
    >
      {disabledPhoneButton
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
            icon={phone}
            title={i18n.t('bottomSheetContent.ride.contactDriver')}
          />
        )}
    </ButtonContainer>
  );
};

CallContactPersonMasked.propTypes = {
  onError: propsTypes.func,
};

CallContactPersonMasked.defaultProps = {
  onError: () => null,
};

export default CallContactPersonMasked;
