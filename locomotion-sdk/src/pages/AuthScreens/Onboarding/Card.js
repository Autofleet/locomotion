import React, { useContext } from 'react';
import i18n from '../../../I18n';
import AddCard from '../../AddCard';
import { SafeView } from './styles';
import Header from './Header';
import ScreenText from './ScreenText';
import { OnboardingContext } from '../../../context/onboarding';
import { ONBOARDING_PAGE_NAMES } from '../../routes';

const Card = () => {
  const { nextScreen } = useContext(OnboardingContext);

  const onDone = async () => {
    nextScreen();
  };
  return (
    <SafeView>
      <Header title={i18n.t('onboarding.pages.code.title')} page={ONBOARDING_PAGE_NAMES.CARD} />
      <AddCard
        onDone={onDone}
        canSkip={false}
        PageText={() => <ScreenText text={i18n.t('onboarding.pages.code.text')} />}
      />
    </SafeView>

  );
};

export default Card;
