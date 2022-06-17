import React, { useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import NotAvilableHere from '../../Components/NotAvilableHere';
import { RideStateContextContext, RidePageContextProvider } from '../../context';
import NewRidePageContextProvider from '../../context/newRideContext';
import {
  PageContainer,
} from './styled';
import Header from '../../Components/Header';
import MainMap from './map';
import AvailabilityContextProvider from '../../context/availability';
import BottomSheet from './RideDrawer/BottomSheet';
import RideOptions from './RideDrawer/RideOptions';
import RideServicesContextProvider from '../../context/rideServicesContext';

const RidePage = ({ menuSide, mapSettings }) => {
  const { initGeoService, showOutOfTerritory } = useContext(RideStateContextContext);
  const navigation = useNavigation();
  const mapRef = React.useRef();

  useEffect(() => {
    initGeoService();
  }, []);

  return (
    <>
      <PageContainer>
        <MainMap ref={mapRef} mapSettings={mapSettings} />
        <Header navigation={navigation} menuSide={menuSide} />
        <BottomSheet>
          {showOutOfTerritory ? (
            <NotAvilableHere onSetAnotherLocation={() => ({})} />
          ) : (
            <>
              <RideOptions />
            </>
          )}
        </BottomSheet>
      </PageContainer>
    </>
  );
};

export default props => (
  <NewRidePageContextProvider {...props}>
    <RidePageContextProvider {...props}>
      <RideServicesContextProvider>
      <AvailabilityContextProvider>
        <RidePage
          {...props}
        />
      </AvailabilityContextProvider>
      </RideServicesContextProvider>
    </RidePageContextProvider>
  </NewRidePageContextProvider>
);
