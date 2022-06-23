import React, {
  useContext, useEffect, useState,
} from 'react';
import RideButtons from './RideButtons';
import ServiceOptions from './ServiceOptions';
import RideNotes from '../../../../popups/RideNotes';
import { RidePageContext } from '../../../../context/newRideContext';
import ChoosePaymentMethod from '../../../../popups/ChoosePaymentMethod';
import { popupNames } from './utils';
import { BottomSheetContext } from '../../../../context/bottomSheetContext';


const RideOptions = () => {
  const [popupToShow, setPopupToShow] = useState<popupNames | null>(null);
  const {
    updateRide,
  } = useContext(RidePageContext);

  const {
    setFooterComponent,
    setSnapPointsState,
  } = useContext(BottomSheetContext);

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
    return () => {
      setFooterComponent(null);
    };
  }, []);

  return (
    <>
      <ServiceOptions />
      <RideNotes
        isVisible={popupToShow === 'notes'}
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
      <ChoosePaymentMethod isVisible={popupToShow === 'payment'} onCancel={() => clearPopup()} />
    </>
  );
};

export default RideOptions;
