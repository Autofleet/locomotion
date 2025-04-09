import React, {
  useCallback,
  useContext, useEffect, useRef, useState,
} from 'react';
import { useIsFocused } from '@react-navigation/native';
import Config from 'react-native-config';
import { ScrollView } from 'react-native';
import Recaptcha from 'react-native-recaptcha-that-works';
import settings from '../../context/settings';
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
import Auth from '../../services/auth';
import { EmailInput, emailSchema } from '../../Components/EmailInput';


const Phone = ({ navigation }) => {
  const { nextScreen, shouldHideCaptcha, fetchHideCaptchaSetting } = useContext(OnboardingContext);
  const { updateState, user, onLogin } = useContext(UserContext);
  const [showErrorText, setShowErrorText] = useState(false);
  const [renderId, setRenderId] = useState(0);
  const [isInvalid, setIsInvalid] = useState(true);
  const recaptchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isLoadingSaveButton, setIsLoadingSaveButton] = useState(false);

  useEffect(() => {
    fetchHideCaptchaSetting();
  }, []);

  const onVerifyCaptcha = async (verifiedCaptchaToken) => {
    Mixpanel.setEvent('Captcha Verified successfully', { verifiedCaptchaToken });
    setCaptchaToken(verifiedCaptchaToken);
  };


  const onPhoneNumberChange = (phoneNumber, isValid) => {
    setShowErrorText(false);
    setIsInvalid(!isValid);
    updateState({ phoneNumber });
  };

  const onEmailChange = async (email) => {
    setShowErrorText(false);
    try {
      await emailSchema.validate({ email });
      setIsInvalid(false);
    } catch (e) {
      setIsInvalid(true);
    }
    updateState({ email });
  };
  const isDevSettingOn = () => Config.DEV_SETTINGS && Config.DEV_SETTINGS === 'true';
  const isDebugPhoneNumber = () => user.phoneNumber === Config.DEV_PAGE_PHONE_NUMBER && isDevSettingOn();

  const ERROR_RESPONSES = {
    429: () => setShowErrorText(i18n.t('login.tooManyRequestError')),
    422: inputType => setShowErrorText(inputType === 'phone' ? i18n.t('login.invalidPhoneNumberError') : i18n.t('login.invalidEmailError')),
    403: () => setShowErrorText(i18n.t('login.clientIsBanned', { appName: Config.OPERATION_NAME })),
  };

  const commonLoginFlow = async (inputType) => {
    try {
      await Auth.updateCaptchaToken(captchaToken);
      await onLogin(inputType === 'phone' ? 'sms' : 'email');
      updateState({ phoneNumber: user.phoneNumber, email: user.email });
      nextScreen(MAIN_ROUTES.LOGIN);
      setIsLoadingSaveButton(false);
    } catch (e) {
      setIsLoadingSaveButton(false);
      console.log('Bad login with response', e);
      const status = e && e.response && e.response.status;
      if (ERROR_RESPONSES[status]) {
        return ERROR_RESPONSES[status](inputType);
      }
      setShowErrorText(i18n.t(`login.${inputType === 'phone' ? 'invalidPhoneNumberError' : 'invalidEmailError'}`));
    }
  };
  const submitPhoneNumber = async () => {
    if (isDebugPhoneNumber()) {
      NavigationService.navigate(MAIN_ROUTES.DEV_SETTINGS_PAGE);
      setIsLoadingSaveButton(false);
      return;
    }
    await commonLoginFlow('phone');
  };

  const submitEmail = async () => {
    await commonLoginFlow('email');
  };

  const submit = async () => {
    if (!isDevSettingOn()) {
      await AppSettings.destroy();
    }
    if (user.phoneNumber && user.phoneNumber.length > 0) {
      await submitPhoneNumber();
    } else if (user.email && user.email.length > 0) {
      await submitEmail();
    }
  };

  useEffect(() => {
    if (isLoadingSaveButton) {
      if (
        !shouldHideCaptcha && Config.CAPTCHA_KEY && recaptchaRef.current && !isDebugPhoneNumber()
      ) {
        recaptchaRef.current.open();
      } else {
        Mixpanel.setEvent('Submit phone number, without captcha , (Config.CAPTCHA_KEY is not defined)');
        submit();
      }
    }
  }, [isLoadingSaveButton]);


  useEffect(() => {
    if (captchaToken) {
      Mixpanel.setEvent('Submit phone number, after captcha');
      submit();
    }
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
          // title={i18n.t('onboarding.pages.phone.title')}
          page={MAIN_ROUTES.LOGIN}
        />
        <ContentContainer>
          <ScreenText
            text={i18n.t('onboarding.pages.login.text')}
            subText={i18n.t('onboarding.pages.login.subText')}
          />
          <EmailInput
            disabled={user.phoneNumber && user.phoneNumber.length > 0}
            onChange={onEmailChange}
            email={user.email}
            error={showErrorText}
          />
          <PhoneNumberInput
            disabled={user.email && user.email.length > 0}
            key={renderId}
            value={user.phoneNumber}
            onPhoneNumberChange={onPhoneNumberChange}
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
          { Config.CAPTCHA_KEY
              && (
              <Recaptcha
                ref={recaptchaRef}
                siteKey={Config.CAPTCHA_KEY}
                baseUrl="https://www.google.com/recaptcha/api/siteverify"
                onVerify={onVerifyCaptcha}
                size="invisible"
                hideBadge={!Config.SHOW_CAPTCHA_ICON}
                onClose={() => {
                  setIsLoadingSaveButton(false);
                  Mixpanel.setEvent('Captcha closed', { captchaToken });
                }
                }
                onError={(e) => {
                  Mixpanel.setEvent('Captcha error', e);
                  setIsLoadingSaveButton(false);
                  // try without captcha on api key issues
                  submit();
                }}
                style={{ backgroundColor: 'transparent' }}

              />
              )
            }
        </ContentContainer>
      </ScrollView>
    </PageContainer>
  );
};

export default Phone;
