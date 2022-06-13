import React, { useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { GeoContextContext, RidePageContextProvider } from '../../context';
import {
  PageContainer,
} from './styled';
import Header from '../../Components/Header';
import MainMap from './map';
import RideSummaryPopup from '../../popups/RideSummaryPopup';
import FutureRideCanceledPopup from '../../popups/FutureRideCanceled';
import BottomSheet from './RideDrawer/BottomSheet';
import AddressSelector from './RideDrawer/AddressSelector';


const RidePage = ({ menuSide, mapSettings }) => {
  const { initGeoService } = useContext(GeoContextContext);
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
        {/*       <RideDrawer
        navigation={navigation}
        focusCurrentLocation={() => {
          if (mapRef && mapRef.current) {
            mapRef.current.focusCurrentLocation();
          }
        }}
        />
        <RideSummaryPopup />
        <FutureRideCanceledPopup
        onClose={() => {
        }}
      /> */}
        <BottomSheet>
          <AddressSelector />
        </BottomSheet>
      </PageContainer>
    </>
  );
};

export default props => (
  <NewRidePageContextProvider {...props}>
    <RidePageContextProvider {...props}>
      <RidePage
        {...props}
      />
    </RidePageContextProvider>
  </NewRidePageContextProvider>
);
