import React, {
  useContext, useEffect,
} from 'react';
import { useNavigation } from '@react-navigation/native';

import geo from '../../services/geo';
import RidePageContextProvider, { RidePageContext } from './ridePageContext';
import {
  PageContainer,
} from './styled';
import Header from '../../Components/Header';
import RideDrawer from './RideDrawer';
import MainMap from './map';
import RideSummaryPopup from '../../popups/RideSummaryPopup';
import FutureRideCanceledPopup from '../../popups/FutureRideCanceled';

const RidePage = ({ menuSide, mapSettings }) => {
  const navigation = useNavigation();

  useEffect(() => {
    geo.init();
  }, []);

  const {
    activeRideState,
    futureRides,
    preRideDetails,
    numberOfPassengers,
    setNumberOfPassengers,
    requestStopPoints,
    rideType,
    setRideType,
    rideOffer,
    offerExpired,
    rideSummaryData,
    setRideSummaryData,
    createOffer,
    cancelOffer,
    cancelRide,
    createRide,
    cancelFutureRide,
    createFutureOffer,
    onRating,
    onRideSchedule,
    onLocationSelect,
    openLocationSelect,
    closeAddressViewer,
    bookValidation,
  } = useContext(RidePageContext);

  return (
    <PageContainer>
      <MainMap mapSettings={mapSettings} />
      <Header navigation={navigation} menuSide={menuSide} />
      <RideDrawer
        navigation={navigation}
        createRide={createRide}
        cancelRide={cancelRide}
        createOffer={createOffer}
        readyToBook={bookValidation(requestStopPoints)}
        openLocationSelect={openLocationSelect}
        requestStopPoints={requestStopPoints}
        activeRide={activeRideState}
        rideType={rideType}
        setRideType={setRideType}
        preRideDetails={preRideDetails}
        onNumberOfPassengerChange={setNumberOfPassengers}
        numberOfPassenger={numberOfPassengers}
        rideOffer={rideOffer}
        cancelOffer={cancelOffer}
        offerExpired={offerExpired}
        onLocationSelect={onLocationSelect}
        closeAddressViewer={closeAddressViewer}
        onRideSchedule={onRideSchedule}
        futureRides={futureRides}
        cancelFutureRide={cancelFutureRide}
        createFutureOffer={createFutureOffer}
      />
      <RideSummaryPopup
        rideSummaryData={rideSummaryData}
        onRating={onRating}
        onClose={() => setRideSummaryData({})}
      />
      <FutureRideCanceledPopup
        onClose={() => {}}
      />
    </PageContainer>
  );
};

export default props => (
  <RidePageContextProvider {...props}>
    <RidePage
      {...props}
    />
  </RidePageContextProvider>
);
