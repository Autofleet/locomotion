import React, {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import { useIsFocused } from '@react-navigation/native';
import Config from 'react-native-config';
import { ScrollView } from 'react-native';
import Recaptcha from 'react-native-recaptcha-that-works';
import i18n from '../../I18n';
import SaveButton from './SaveButton';
import { OnboardingContext } from '../../context/onboarding';
import { ErrorText } from './styles';
import Header from './Header';
import ScreenText from './ScreenText/index';
import { loginApi } from '../../context/user/api';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import { MAIN_ROUTES } from '../routes';
import { UserContext } from '../../context/user';
import AppSettings from '../../services/app-settings';
import * as NavigationService from '../../services/navigation';
import { PageContainer, ContentContainer } from '../styles';
import Auth from '../../services/auth';


const Phone = ({ navigation }) => {
  const { nextScreen } = useContext(OnboardingContext);
  const { updateState, user, onLogin } = useContext(UserContext);
  const [showErrorText, setShowErrorText] = useState(false);
  const [renderId, setRenderId] = useState(0);
  const [isInvalid, setIsInvalid] = useState(true);
  const recaptchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState(null);

  const onVerifyCaptcha = async (token) => {
    setCaptchaToken(token);
    await Auth.updateCaptchaToken(token);
  };


  const handleCaptcha = useCallback(() => {
    if (Config.CAPTCHA_KEY) {
      if (recaptchaRef.current) {
        recaptchaRef.current.open();
      }
    } else {
      NavigationService.navigate(MAIN_ROUTES.PHONE);
    }
  }, [Config.CAPTCHA_KEY]);

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
        return;
      }
      if (!isDevSettingOn()) {
        await AppSettings.destroy();
      }
      await onLogin(user.phoneNumber);
      updateState({ phoneNumber: user.phoneNumber });
      nextScreen(MAIN_ROUTES.PHONE);
    } catch (e) {
      console.log('Bad login with response', e);
      const status = e && e.response && e.response.status;
      if (ERROR_RESPONSES[status]) {
        return ERROR_RESPONSES[status]();
      }
      setShowErrorText(i18n.t('login.invalidPhoneNumberError'));
    }
  };
  useEffect(() => {
    submitPhoneNumber();
  }, [captchaToken]);


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
            isInvalid={isInvalid}
            onNext={handleCaptcha}
            onFail={() => setShowErrorText(i18n.t('login.invalidPhoneNumberError'))
              }
          />
          { Config.CAPTCHA_KEY
              && (
              <Recaptcha
                ref={recaptchaRef}
                siteKey={Config.CAPTCHA_KEY}
                baseUrl="https://www.google.com/recaptcha/api/siteverify"
                onVerify={onVerifyCaptcha}
                size="invisible"
                hideBadge={!Config.SHOW_CAPTCHA_ICON}
              />
              )
            }
        </ContentContainer>
      </ScrollView>
    </PageContainer>
  );
};

export default Phone;
