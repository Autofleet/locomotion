import React, { useEffect, useState } from 'react';
import i18n from '../../../I18n';
import { ButtonText, NavButton } from './styles';


const SaveButton = ({
  isInvalid, onFail, onNext, buttonText, isLoading,
}) => {
  const [loading, setLoading] = useState(false);
  const nextScreen = async () => {
    setLoading(true);
    if (isInvalid) {
      onFail();
      setLoading(false);
    } else if (onNext) {
      await onNext();
    }
  };
  useEffect(() => {
    setLoading(!!isLoading);
  }, []);
  return (
    <NavButton data-test-id="OnboardingNextButton" onPress={nextScreen} isLoading={loading} disabled={isInvalid || loading}>
      <ButtonText>{buttonText || i18n.t('general.next')}</ButtonText>
    </NavButton>
  );
};

export default SaveButton;