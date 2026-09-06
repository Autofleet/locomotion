import React, { useState, useContext } from 'react';
import propsTypes from 'prop-types';
import Mixpanel from '../../../services/Mixpanel';
import Loader from '../../Loader';
import DeviceService from '../../../services/device';
import CompatModal from '../../CompatModal';

import i18n from '../../../I18n';
import {
  ButtonContainer, DialogCard, DialogTitle, DialogRow, DialogOption,
} from './styled';
import GenericRideButton from '../../GenericRideButton';
import phone from '../../../assets/bottomSheet/phone.svg';
import { RidePageContext } from '../../../context/newRideContext';

const CallContactPersonMasked = ({ onError = () => null }: { onError?: any }) => {
  const { getCallNumbers } = useContext(RidePageContext);
  const [disabledPhoneButton, setDisabledPhoneButton] = useState(false);
  const [dialogNumber, setDialogNumber] = useState<string | null>(null);

  const callPhone = (phoneNumber: any) => {
    Mixpanel.clickEvent('Call contact person');
    DeviceService.call(phoneNumber);
  };

  const smsPhone = (phoneNumber: any) => {
    Mixpanel.clickEvent('SMS contact person');
    DeviceService.sms(phoneNumber, '');
  };

  const handleCallPress = () => {
    if (dialogNumber) callPhone(dialogNumber);
    setDialogNumber(null);
  };

  return (
    <>
      <ButtonContainer
        disabled={disabledPhoneButton}
        onPress={async () => {
          setDisabledPhoneButton(true);
          try {
            const number = await getCallNumbers();
            setDialogNumber(number as unknown as string | null);
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
      <CompatModal
        isVisible={!!dialogNumber}
        onBackdropPress={() => setDialogNumber(null)}
        onBackButtonPress={() => setDialogNumber(null)}
      >
        <DialogCard>
          <DialogTitle>{`${i18n.t('bottomSheetContent.ride.contactDriver')}`}</DialogTitle>
          <DialogRow onPress={handleCallPress}>
            <DialogOption>{`${i18n.t('bottomSheetContent.ride.phoneCallOptions.call')}`}</DialogOption>
          </DialogRow>
          <DialogRow
            onPress={() => {
              smsPhone(dialogNumber);
              setDialogNumber(null);
            }}
          >
            <DialogOption>{`${i18n.t('bottomSheetContent.ride.phoneCallOptions.sms')}`}</DialogOption>
          </DialogRow>
          <DialogRow onPress={() => setDialogNumber(null)}>
            <DialogOption cancel>{`${i18n.t('bottomSheetContent.ride.phoneCallOptions.cancel')}`}</DialogOption>
          </DialogRow>
        </DialogCard>
      </CompatModal>
    </>
  );
};

CallContactPersonMasked.propTypes = {
  onError: propsTypes.func,
};

export default CallContactPersonMasked;
