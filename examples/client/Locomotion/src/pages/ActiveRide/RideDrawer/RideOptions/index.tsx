import React, {
  useContext, useEffect, useState,
} from 'react';
import { RIDE_POPUPS } from '../../../../context/newRideContext/utils';
import RideButtons from './RideButtons';
import ServiceOptions from './ServiceOptions';
import RideNotes from '../../../../popups/RideNotes';
import { RidePageContext } from '../../../../context/newRideContext';
import ChoosePaymentMethod from '../../../../popups/ChoosePaymentMethod';
import { popupNames } from './utils';
import { BottomSheetContext, SNAP_POINT_STATES } from '../../../../context/bottomSheetContext';
import payments from '../../../../context/payments';
import { PaymentMethodInterface } from '../../../../context/payments/interface';
import { RideStateContextContext } from '../../../../context/ridePageStateContext';
import { BS_PAGES } from '../../../../context/ridePageStateContext/utils';


const RideOptions = () => {
  const [popupToShow, setPopupToShow] = useState<popupNames | null>(null);
  const {
    updateRide,
    ride,
    ridePopup,
    stopRequestInterval,
  } = useContext(RidePageContext);

  const {
    setFooterComponent,
  } = useContext(BottomSheetContext);

  const {
    changeBsPage,
  } = useContext(RideStateContextContext);

  const {
    getClientDefaultMethod,
  } = payments.useContainer();

  const setPopupName = (popupName: popupNames) => {
    setPopupToShow(popupName);
  };

  const clearPopup = () => {
    setPopupToShow(null);
  };

  useEffect(() => {
    setFooterComponent(() => (
      <RideButtons
        displayPassenger={false}
        setPopupName={setPopupName}
      />
    ));

    const paymentMethod: PaymentMethodInterface | undefined = getClientDefaultMethod();
    if (paymentMethod) {
      updateRide({
        paymentMethodId: paymentMethod.id,
      });
    }

    changeBsPage(BS_PAGES.SERVICE_ESTIMATIONS);
    return () => {
      setFooterComponent(null);
    };
  }, []);

  useEffect(() => {
    if (ridePopup === RIDE_POPUPS.FAILED_SERVICE_REQUEST) {
      changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
      stopRequestInterval();
    }
  }, [ridePopup]);

  return (
    <>
      <ServiceOptions />
      <RideNotes
        isVisible={popupToShow === 'notes'}
        notes={ride?.notes}
        onSubmit={(text: string) => {
          updateRide({
            notes: text,
          });
          clearPopup();
        }}
        onCancel={() => {
          clearPopup();
        }}
      />
      <ChoosePaymentMethod
        isVisible={popupToShow === 'payment'}
        onCancel={() => clearPopup()}
        onSubmit={(payment: any) => {
          updateRide({
            paymentMethodId: payment,
          });
        }}
      />
    </>
  );
};

export default RideOptions;
