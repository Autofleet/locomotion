import React, { useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { GeoContextContext, RidePageContextProvider } from '../../context';
import {
  PageContainer,
} from './styled';
import Header from '../../Components/Header';
import MainMap from './map';
import BottomSheet from './RideDrawer/AddressSelector';

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
        <BottomSheet />
      </PageContainer>
    </>
  );
};

export default props => (
  <RidePageContextProvider {...props}>
    <RidePage
      {...props}
    />
  </RidePageContextProvider>
);
