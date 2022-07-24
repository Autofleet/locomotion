import React, { useContext, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
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
import { PageContainer, ContentContainer } from '../styles';

const Phone = ({ navigation }) => {
  const { nextScreen } = useContext(OnboardingContext);
  const { updateState, user } = useContext(UserContext);
  const [showErrorText, setShowErrorText] = useState(false);
  const [renderId, setRenderId] = useState(0);
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
      setShowErrorText(i18n.t('login.invalidPhoneNumberError'));
    }
  };

  // Force render the component when the focus changes
  useState(() => {
    const didBlurSubscription = navigation.addListener(
      'focus',
      () => {
        setRenderId(Math.random());
      },
    );

    return () => {
      didBlurSubscription.remove();
    };
  }, []);

  return (
    <PageContainer>
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
          onNext={onSubmitPhoneNumber}
          onFail={() => setShowErrorText(i18n.t('login.invalidPhoneNumberError'))
          }
        />
      </ContentContainer>
    </PageContainer>
  );
};

export default Phone;
