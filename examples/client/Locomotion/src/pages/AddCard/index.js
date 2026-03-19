import React from 'react';
import NewCreditForm from '../../Components/NewCreditForm';

export default function ({ onDone, canSkip = true, PageText }) {
  return (
    <NewCreditForm
      PageText={PageText}
      canSkip={canSkip}
      onDone={onDone}
    />
  );
}
