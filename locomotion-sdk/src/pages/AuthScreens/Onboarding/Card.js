import React from 'react';
import i18n from '../../../I18n';
import AddCard from '../../AddCard';
import { SafeView } from './styles';
import Header from './Header';
import ScreenText from './ScreenText';
import onboardingContext from '../../../context/onboarding';
import PaymentsContext from '../../../context/payments';

const Card = () => {
  const { navigateBasedOnUser, onboardingState } = onboardingContext.useContainer();
  const { getPaymentMethods } = PaymentsContext.useContainer();

  const onDone = async () => {
    const methods = await getPaymentMethods();
    navigateBasedOnUser({ ...onboardingState, cards: methods });
  };
  return (
    <SafeView>
      <Header title={i18n.t('onboarding.pages.code.title')} page={'card'}/>
      <AddCard
        onDone={onDone}
        canSkip={false}
        PageText={() => <ScreenText text={i18n.t('onboarding.pages.code.text')} />}
      />
    </SafeView>

  );
};

export default Card;
