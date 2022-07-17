import React, { useState, useRef, useContext } from 'react';
import {
  UIManager, findNodeHandle, Platform, ActionSheetIOS,
} from 'react-native';
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
  const inputRef = useRef<any>(null);

  const ActionMenu = (number: any, elementRef: any) => {
    const callPhone = (phoneNumber: any) => {
      Mixpanel.clickEvent('Call contact person');
      DeviceService.call(phoneNumber);
    };

    const smsPhone = (phoneNumber: any) => {
      Mixpanel.clickEvent('SMS contact person');
      DeviceService.sms(phoneNumber, '');
    };

    const options = [i18n.t('bottomSheetContent.ride.phoneCallOptions.call'), i18n.t('bottomSheetContent.ride.phoneCallOptions.sms')];
    if (Platform.OS === 'android') {
      UIManager.showPopupMenu(
        findNodeHandle(elementRef.current) as number,
        options,
        () => undefined,
        (action, buttonIndex) => {
          if (buttonIndex === 0) {
            callPhone(number);
          }

          if (buttonIndex === 1) {
            smsPhone(number);
          }
        },
      );
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [i18n.t('bottomSheetContent.ride.phoneCallOptions.cancel'), ...options],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            callPhone(number);
          }

          if (buttonIndex === 2) {
            smsPhone(number);
          }
        },
      );
    }
  };

  return (
    <ButtonContainer
      disabled={disabledPhoneButton}
      ref={inputRef}
      onPress={async () => {
        setDisabledPhoneButton(true);
        try {
          const number = await getCallNumbers();
          ActionMenu(number, inputRef);
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
