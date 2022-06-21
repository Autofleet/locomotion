import React, { useContext, useState } from 'react';
import i18n from '../../../I18n';
import OnboardingNavButtons from './OnboardingNavButtons';
import { OnboardingContext } from '../../../context/onboarding';
import { ErrorText, PageContainer, SafeView } from './styles';
import Header from './Header';
import ScreenText from './ScreenText/index';
import { loginApi } from '../../../context/user/api';
import PhoneNumberInput from '../../../Components/PhoneNumberInput';
import { MAIN_ROUTES } from '../../routes';
import { UserContext } from '../../../context/user';
import AppSettings from '../../../services/app-settings';

const Phone = () => {
  const { nextScreen } = useContext(OnboardingContext);
  const { updateState, user } = useContext(UserContext);
  const [showErrorText, setShowErrorText] = useState(false);
  const [isInvalid, setIsInvalid] = useState(true);
  const onPhoneNumberChange = (phoneNumber, isValid) => {
    setShowErrorText(false);
    setIsInvalid(!isValid);
    updateState({ phoneNumber });
  };

  const onSubmitPhoneNumber = async () => {
    try {
      await AppSettings.destroy();
      await loginApi({
        phoneNumber: user.phoneNumber,
      });
      updateState({ phoneNumber: user.phoneNumber });
      nextScreen(MAIN_ROUTES.PHONE);
    } catch (e) {
      console.log('Bad login with response', e);
      setShowErrorText(e.message);
    }
  };

  return (
    <SafeView>
      <Header
        title={i18n.t('onboarding.pages.phone.title')}
        page={MAIN_ROUTES.PHONE}
      />
      <PageContainer>
        <ScreenText
          text={i18n.t('onboarding.pages.phone.text')}
          subText={i18n.t('onboarding.pages.phone.subText')}
        />
        <PhoneNumberInput
          value={user.phoneNumber}
          onPhoneNumberChange={onPhoneNumberChange}
          autoFocus
          error={showErrorText}
        />
        {showErrorText && <ErrorText>{showErrorText}</ErrorText>}
        <OnboardingNavButtons
          isInvalid={isInvalid}
          onNext={onSubmitPhoneNumber}
          onFail={() => setShowErrorText(i18n.t('login.invalidPhoneNumberError'))
          }
        />
      </PageContainer>
    </SafeView>
  );
};

export default Phone;
