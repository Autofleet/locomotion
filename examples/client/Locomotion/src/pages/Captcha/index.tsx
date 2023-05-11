import React, { useCallback, useEffect, useRef } from 'react';
import { View, Alert } from 'react-native';
import Config from 'react-native-config';
import Recaptcha, { RecaptchaHandles } from 'react-native-recaptcha-that-works';
import { Text } from 'react-native-svg';
import { NavButton } from '../Profile/SaveButton/styles';

// ...

const Captcha = () => {
  const recaptcha = useRef<RecaptchaHandles>(null);

  const handleOpenPress = useCallback(() => {
    console.log('open sesame');
    if (recaptcha.current) {
      console.log('opening');
      recaptcha.current?.open();
    }
  }, []);

  const onVerify = (token: string) => {
    Alert.alert('success!', token);
  };
  const onLoad = () => {
    console.log('loaded');
  };

  return (Config.CAPTCHA_KEY ? (
    <View>
      <NavButton onPress={handleOpenPress} />
      <Recaptcha
        ref={recaptcha}
        siteKey={Config.CAPTCHA_KEY}
        onLoad={onLoad}
        baseUrl="https://www.google.com/recaptcha/api/siteverify"
        onVerify={onVerify}
        size="invisible"
        enterprise={false}
        hideBadge={false}
        footerComponent={<Text>Footer here</Text>}
      />
    </View>
  ) : <></>);
};
export default Captcha;
