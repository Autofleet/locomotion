import React, { useContext } from 'react';
import i18n from '../../I18n';
import AddCard from '../AddCard';
import Header from './Header';
import ScreenText from './ScreenText';
import { OnboardingContext } from '../../context/onboarding';
import { MAIN_ROUTES } from '../routes';
import { PageContainer, ContentContainer } from '../styles';

const Card = () => {
  const { nextScreen } = useContext(OnboardingContext);

  const onDone = async () => {
    nextScreen(MAIN_ROUTES.CARD);
  };
  return (
    <PageContainer>
      <Header title={i18n.t('onboarding.pages.card.title')} page={MAIN_ROUTES.CARD} />
      <ContentContainer>
        <AddCard
          onDone={onDone}
          canSkip={false}
          PageText={() => <ScreenText text={i18n.t('onboarding.pages.card.text')} />}
        />
      </ContentContainer>
    </PageContainer>
  );
};

export default Card;
