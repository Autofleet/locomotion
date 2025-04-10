import React, { useContext, useState } from 'react';
import Config from 'react-native-config';
import { ScrollView } from 'react-native';
import Mixpanel from '../../services/Mixpanel';
import i18n from '../../I18n';
import SaveButton from './SaveButton';
import { OnboardingContext } from '../../context/onboarding';
import { ErrorText } from './styles';
import Header from './Header';
import ScreenText from './ScreenText/index';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import { MAIN_ROUTES } from '../routes';
import { UserContext } from '../../context/user';
import AppSettings from '../../services/app-settings';
import * as NavigationService from '../../services/navigation';
import { PageContainer, ContentContainer } from '../styles';
import Captcha from './Captcha';


const Phone = ({ navigation }) => {
  const { nextScreen } = useContext(OnboardingContext);
  const { updateState, user, onLogin } = useContext(UserContext);
  const [showErrorText, setShowErrorText] = useState(false);
  const [renderId, setRenderId] = useState(0);
  const [isInvalid, setIsInvalid] = useState(true);
  const [isLoadingSaveButton, setIsLoadingSaveButton] = useState(false);

  const onPhoneNumberChange = (phoneNumber, isValid) => {
    setShowErrorText(false);
    setIsInvalid(!isValid);
    updateState({ phoneNumber });
  };
  const isDevSettingOn = () => Config.DEV_SETTINGS && Config.DEV_SETTINGS === 'true';
  const isDebugPhoneNumber = () => user.phoneNumber === Config.DEV_PAGE_PHONE_NUMBER && isDevSettingOn();

  const ERROR_RESPONSES = {
    429: () => setShowErrorText(i18n.t('login.tooManyRequestError')),
    422: () => setShowErrorText(i18n.t('login.invalidPhoneNumberError')),
    403: () => setShowErrorText(i18n.t('login.clientIsBanned', { appName: Config.OPERATION_NAME })),
  };

  const submitPhoneNumber = async () => {
    try {
      if (isDebugPhoneNumber()) {
        NavigationService.navigate(MAIN_ROUTES.DEV_SETTINGS_PAGE);
        setIsLoadingSaveButton(false);
        return;
      }
      if (!isDevSettingOn()) {
        await AppSettings.destroy();
      }
      await onLogin(user.phoneNumber);
      updateState({ phoneNumber: user.phoneNumber });
      nextScreen(MAIN_ROUTES.PHONE);
      setIsLoadingSaveButton(false);
    } catch (e) {
      setIsLoadingSaveButton(false);
      console.log('Bad login with response', e);
      const status = e && e.response && e.response.status;
      if (ERROR_RESPONSES[status]) {
        return ERROR_RESPONSES[status]();
      }
      setShowErrorText(i18n.t('login.invalidPhoneNumberError'));
    }
  };

  const handleCaptchaVerified = () => {
    Mixpanel.setEvent('Submit phone number, after captcha');
    submitPhoneNumber();
  };

  const handleCaptchaError = () => {
    setIsLoadingSaveButton(false);
    submitPhoneNumber();
  };

  const handleCaptchaClosed = () => {
    setIsLoadingSaveButton(false);
  };

  // Force render the component when the focus changes
  useState(() => {
    const didBlurSubscription = navigation.addListener(
      'focus',
      () => {
        setShowErrorText(null);
        setRenderId(Math.random());
      },
    );

    return () => {
      didBlurSubscription.remove();
    };
  }, []);

  return (
    <PageContainer>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Header
          title={i18n.t('onboarding.pages.phone.title')}
          page={MAIN_ROUTES.PHONE}
        />
        <ContentContainer>
          <ScreenText
            text={i18n.t('onboarding.pages.phone.text')}
            subText={i18n.t('onboarding.pages.phone.subText')}
          />
          <PhoneNumberInput
            key={renderId}
            value={user.phoneNumber}
            onPhoneNumberChange={onPhoneNumberChange}
            autoFocus
            error={showErrorText}
          />
          {showErrorText && <ErrorText>{showErrorText}</ErrorText>}
          <SaveButton
            isLoading={isLoadingSaveButton}
            isInvalid={isInvalid}
            onNext={() => setIsLoadingSaveButton(true)}
            onFail={() => setShowErrorText(i18n.t('login.invalidPhoneNumberError'))
              }
          />
          <Captcha
            isOpen={isLoadingSaveButton}
            onVerified={handleCaptchaVerified}
            onError={handleCaptchaError}
            onClose={handleCaptchaClosed}
          />
        </ContentContainer>
      </ScrollView>
    </PageContainer>
  );
};

export default Phone;
