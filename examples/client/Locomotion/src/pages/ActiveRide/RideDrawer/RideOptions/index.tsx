import React, {
  useContext, useEffect, useState,
} from 'react';
import { Portal } from '@gorhom/portal';
import { MAIN_ROUTES } from '../../../routes';
import i18n from '../../../../I18n';
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
import * as navigationService from '../../../../services/navigation';
import { PAYMENT_METHODS } from '../../../../lib/commonTypes';

const RideOptions = () => {
  const usePayments = payments.useContainer();
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<PaymentMethodInterface | undefined>(undefined);
  const [popupToShow, setPopupToShow] = useState<popupNames | null>(null);
  const {
    updateRidePayload,
    ride,
    ridePopup,
    stopRequestInterval,
    serviceEstimations,
    chosenService,
  } = useContext(RidePageContext);

  const {
    setFooterComponent,
  } = useContext(BottomSheetContext);

  const {
    changeBsPage,
  } = useContext(RideStateContextContext);

  const setPopupName = (popupName: popupNames) => {
    setPopupToShow(popupName);
  };

  const clearPopup = () => {
    setPopupToShow(null);
  };

  const showCash = !!serviceEstimations?.filter((se: any) => se.allowedPaymentMethods.includes(PAYMENT_METHODS.CASH)).length;

  useEffect(() => {
    const updateDefaultPaymentMethod = async () => {
      const paymentMethod: any = usePayments.getClientDefaultMethod(
        chosenService?.allowedPaymentMethods.includes(PAYMENT_METHODS.CASH),
      );
      if (paymentMethod && paymentMethod?.id) {
        updateRidePayload({
          paymentMethodId: paymentMethod.id,
        });
        setDefaultPaymentMethod(paymentMethod);
      }
    };
    if (!ride.paymentMethodId) {
      updateDefaultPaymentMethod();
    }
  }, [usePayments.paymentMethods, showCash]);


  useEffect(() => {
    setFooterComponent(() => (
      <RideButtons
        displayPassenger={false}
        setPopupName={setPopupName}
      />
    ));

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
      <Portal>
        <RideNotes
          isVisible={popupToShow === 'notes'}
          notes={ride?.notes}
          onSubmit={(text: string) => {
            updateRidePayload({
              notes: text,
            });
            clearPopup();
          }}
          onCancel={() => {
            clearPopup();
          }}
        />

        <ChoosePaymentMethod
          onAddNewMethod={() => {
            clearPopup();
            setTimeout(() => {
              navigationService.navigate(MAIN_ROUTES.PAYMENT, { showAdd: true, rideFlow: true });
            }, 500);
          }}
          showCash={showCash}
          selected={ride?.paymentMethodId
            && usePayments.paymentMethods.find((pm: any) => ride.paymentMethodId === pm.id)
            ? ride.paymentMethodId : defaultPaymentMethod?.id}
          rideFlow
          isVisible={popupToShow === 'payment'}
          onCancel={() => clearPopup()}
          onSubmit={(payment: any) => {
            updateRidePayload({
              paymentMethodId: payment,
            });
          }}
        />
      </Portal>
    </>
  );
};

export default RideOptions;
