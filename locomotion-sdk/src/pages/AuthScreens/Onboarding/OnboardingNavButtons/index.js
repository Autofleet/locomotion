import React, { useState } from 'react';
import i18n from '../../../../I18n';
import { ButtonText, NavButton } from './styles';


const OnboardingNavButtons = ({
  isInvalid, onFail, onNext, buttonText,
}) => {
  const [loading, setLoading] = useState(false);
  const nextScreen = async () => {
    setLoading(true);
    if (isInvalid) {
      onFail();
    } else if (onNext) {
      await onNext();
    }
    setLoading(false);
  };
  return (
    <NavButton data-test-id="OnboardingNextButton" onPress={nextScreen} disabled={isInvalid || loading}>
      <ButtonText>{buttonText || i18n.t('general.next')}</ButtonText>
    </NavButton>
  );
};

export default OnboardingNavButtons;
