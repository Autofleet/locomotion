import React from 'react';
import i18n from '../I18n';
import BasicPopup from './BasicPopup';

export default function () {
  return (
    <BasicPopup id="rideOver" title={i18n.t('popups.rideOver.main')} subTitle={i18n.t('popups.rideOver.sub')} closeAfter={10000} />
  );
}
