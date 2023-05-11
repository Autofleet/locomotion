import React, { useEffect, useRef } from 'react';
import { View, Button } from 'react-native';
import Config from 'react-native-config';
import Recaptcha, { RecaptchaHandles } from 'react-native-recaptcha-that-works';

// ...

const Captcha = () => {
  const recaptcha = useRef<RecaptchaHandles>(null);

  useEffect(() => {
    if (recaptcha?.current) {
      recaptcha.current.open();
    }
  }, [recaptcha]);

  const onVerify = (token: string) => {
    console.log('success!', token);
  };

  return (Config.CAPTCHA_KEY ? (
    <View>
      <Recaptcha
        ref={recaptcha}
        siteKey={Config.CAPTCHA_KEY}
        baseUrl="https://www.google.com/recaptcha/api/siteverify"
        onVerify={onVerify}
        size="normal"
      />
    </View>
  ) : <></>);
};
export default Captcha;
