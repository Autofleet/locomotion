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

const GOOGLE_RECAPTCHA_URL = 'https://www.google.com/recaptcha/api/siteverify';
const CAPTCHA_WATCHDOG_MS = 30000;

const Captcha = ({
  onVerified,
  onClose = undefined,
  onError = undefined,
  isOpen,
}: CaptchaProps) => {
  const { shouldHideCaptcha, fetchHideCaptchaSetting } = useContext(OnboardingContext);
  const { user } = useContext(UserContext);
  const recaptchaRef = useRef<RecaptchaHandles | null>(null);
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const verifiedRef = useRef(false);
  const pendingCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDevSettingOn = () => Config.DEV_SETTINGS && Config.DEV_SETTINGS === 'true';
  const isDebugPhoneNumber = user?.phoneNumber === Config.DEV_PAGE_PHONE_NUMBER && isDevSettingOn();

  const clearWatchdog = useCallback(() => {
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  }, []);

  const cancelPendingClose = useCallback(() => {
    if (pendingCloseRef.current) {
      clearTimeout(pendingCloseRef.current);
      pendingCloseRef.current = null;
    }
  }, []);

  const onVerifyCaptcha = useCallback(async (verifiedCaptchaToken: string) => {
    if (verifiedRef.current) {
      return;
    }
    cancelPendingClose();
    clearWatchdog();
    verifiedRef.current = true;
    try {
      Mixpanel.setEvent('Captcha Verified successfully', { verifiedCaptchaToken });
      await Auth.updateCaptchaToken(verifiedCaptchaToken);
      onVerified();
    } catch (error) {
      onError?.();
      Mixpanel.setEvent('Captcha verification error');
    }
  }, [cancelPendingClose, clearWatchdog, onVerified, onError]);

  const handleClose = useCallback(() => {
    clearWatchdog();
    cancelPendingClose();
    pendingCloseRef.current = setTimeout(() => {
      pendingCloseRef.current = null;
      if (!verifiedRef.current) {
        Mixpanel.setEvent('Captcha closed');
        onClose?.();
      }
    }, 0);
  }, [clearWatchdog, cancelPendingClose, onClose]);

  const handleError = useCallback((error: string) => {
    if (verifiedRef.current) {
      return;
    }
    cancelPendingClose();
    clearWatchdog();
    verifiedRef.current = true;
    Mixpanel.setEvent('Captcha error', error);
    onError?.();
  }, [cancelPendingClose, clearWatchdog, onError]);

  useEffect(() => {
    fetchHideCaptchaSetting();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      clearWatchdog();
      cancelPendingClose();
      verifiedRef.current = false;
      return undefined;
    }

    verifiedRef.current = false;

    if (recaptchaRef.current && Config.CAPTCHA_KEY && !isDebugPhoneNumber && !shouldHideCaptcha) {
      recaptchaRef.current.open();
      watchdogRef.current = setTimeout(() => {
        watchdogRef.current = null;
        cancelPendingClose();
        if (!verifiedRef.current) {
          verifiedRef.current = true;
          Mixpanel.setEvent('Captcha watchdog timeout');
          onError?.();
        }
      }, CAPTCHA_WATCHDOG_MS);
    } else {
      Mixpanel.setEvent('Submit phone number, without captcha , (Config.CAPTCHA_KEY is not defined)');
      onVerified();
    }

    return () => {
      clearWatchdog();
      cancelPendingClose();
    };
  }, [isOpen, shouldHideCaptcha, isDebugPhoneNumber]);

  if (!Config.CAPTCHA_KEY) {
    return null;
  }

  return (
    <Recaptcha
      ref={recaptchaRef}
      siteKey={Config.CAPTCHA_KEY}
      baseUrl={GOOGLE_RECAPTCHA_URL}
      onVerify={onVerifyCaptcha}
      size="invisible"
      hideBadge={!Config.SHOW_CAPTCHA_ICON}
      onClose={handleClose}
      onError={handleError}
      style={{ backgroundColor: 'transparent' }}
    />
  );
};

export default Captcha;
