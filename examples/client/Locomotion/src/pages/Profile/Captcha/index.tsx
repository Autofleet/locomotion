import React, {
  useRef, useCallback, useContext, useEffect,
} from 'react';
import Config from 'react-native-config';
import Recaptcha, { RecaptchaHandles } from 'react-native-recaptcha-that-works';
import { UserContext } from '../../../context/user';
import Mixpanel from '../../../services/Mixpanel';
import Auth from '../../../services/auth';
import { OnboardingContext } from '../../../context/onboarding';

interface CaptchaProps {
  onVerified: () => void;
  onClose?: () => void;
  onError?: () => void;
  isOpen: boolean;
}

const Captcha: React.FC<CaptchaProps> = ({
  onVerified,
  onClose,
  onError,
  isOpen,
}) => {
  const { shouldHideCaptcha, fetchHideCaptchaSetting } = useContext(OnboardingContext);
  const { user } = useContext(UserContext);
  const recaptchaRef = useRef<RecaptchaHandles | null>(null);
  const isDevSettingOn = () => Config.DEV_SETTINGS && Config.DEV_SETTINGS === 'true';
  const isDebugPhoneNumber = user?.phoneNumber === Config.DEV_PAGE_PHONE_NUMBER && isDevSettingOn();

  const onVerifyCaptcha = useCallback(async (verifiedCaptchaToken: string) => {
    try {
      Mixpanel.setEvent('Captcha Verified successfully', { verifiedCaptchaToken });
      await Auth.updateCaptchaToken(verifiedCaptchaToken);
      onVerified();
    } catch (error) {
      console.error('Captcha verification failed:', error);
      onError?.();
      Mixpanel.setEvent('Captcha verification error');
    }
  }, [onVerified, onError]);

  const handleClose = () => {
    Mixpanel.setEvent('Captcha closed');
    onClose?.();
  };

  const handleError = (error: string) => {
    Mixpanel.setEvent('Captcha error', error);
    onError?.();
  };

  useEffect(() => {
    fetchHideCaptchaSetting();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (recaptchaRef.current && Config.CAPTCHA_KEY && !isDebugPhoneNumber && !shouldHideCaptcha) {
      recaptchaRef.current.open();
    } else {
      Mixpanel.setEvent('Submit phone number, without captcha , (Config.CAPTCHA_KEY is not defined)');
      onVerified();
    }
  }, [isOpen, shouldHideCaptcha, isDebugPhoneNumber]);

  if (!Config.CAPTCHA_KEY) {
    return null;
  }

  return (
    <Recaptcha
      ref={recaptchaRef}
      siteKey={Config.CAPTCHA_KEY}
      baseUrl="https://www.google.com/recaptcha/api/siteverify"
      onVerify={onVerifyCaptcha}
      size="invisible"
      hideBadge={!Config.SHOW_CAPTCHA_ICON}
      onClose={handleClose}
      onError={handleError}
      style={{ backgroundColor: 'transparent' }}
    />
  );
};

Captcha.defaultProps = {
  onClose: undefined,
  onError: undefined,
};

export default Captcha;
