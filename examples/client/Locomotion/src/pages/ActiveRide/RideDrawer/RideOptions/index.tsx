import React, { Fragment, useContext, useState } from 'react';
import RideButtons from './RideButtons';
import ServiceOptions from './ServiceOptions';
import RideNotes from '../../../../popups/RideNotes';
import { RidePageContext } from '../../../../context/newRideContext';

type popupNames = 'notes' | 'payment' | 'passenger';

const RideOptions = () => {
  const [popupToShow, setPopupToShow] = useState<popupNames | null>(null);
  const {
    updateRide,
} = useContext(RidePageContext);

  const setPopupName = (popupName: popupNames) => {
    setPopupToShow(popupName);
  }

  const clearPopup = () => {
    setPopupToShow(null);
  }
  return (
  <Fragment>
    <ServiceOptions />
    <RideButtons 
      displayPassenger={false} 
      setPopupName={setPopupName}
    />
    <RideNotes 
      isVisible={popupToShow === 'notes'} 
      onSubmit={(text: string) =>{
        console.log('text', text)
        updateRide({
          notes: text
        })
        clearPopup();
      }}
      onCancel={() => {
        clearPopup();
      }}
    />
  </Fragment>
)};

export default RideOptions;
