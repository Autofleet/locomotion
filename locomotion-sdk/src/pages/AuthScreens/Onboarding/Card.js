import React, { useContext } from 'react';
import i18n from '../../../I18n';
import AddCard from '../../AddCard';
import { SafeView } from './styles';
import Header from './Header';
import ScreenText from './ScreenText';
import { OnboardingContext } from '../../../context/onboarding';
import { AUTH_ROUTES } from '../../routes';

const Card = () => {
  const { nextScreen } = useContext(OnboardingContext);

  const onDone = async () => {
    nextScreen(AUTH_ROUTES.CARD);
  };
  return (
    <SafeView>
      <Header title={i18n.t('onboarding.pages.code.title')} page={AUTH_ROUTES.CARD} />
      <AddCard
        onDone={onDone}
        canSkip={false}
        PageText={() => <ScreenText text={i18n.t('onboarding.pages.code.text')} />}
      />
    </SafeView>

  );
};

export default Card;
