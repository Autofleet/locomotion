import React, { Fragment } from 'react';
import i18n from '../I18n';
import BasicPopup from './BasicPopup';
import RideSummaryPopup from './RideSummaryPopup';

export default () => (
  <Fragment>
    {/* <BasicPopup id="rideCancel" title={i18n.t('popups.rideCancel.main')} subTitle={i18n.t('popups.rideCancel.sub')} /> */}
    <BasicPopup id="rideOver" title={i18n.t('popups.rideOver.main')} subTitle={i18n.t('popups.rideOver.sub')} closeAfter={10000} />
    <RideSummaryPopup />
    {/* <BasicPopup id="rideRejected" title={i18n.t('popups.rideRejected.main')} subTitle={i18n.t('popups.rideRejected.sub')} closeAfter={10000} /> */}
  </Fragment>
);
