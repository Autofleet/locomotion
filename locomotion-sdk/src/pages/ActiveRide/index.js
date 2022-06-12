import React, { useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import geo from '../../services/geo';
import RidePageContextProvider, { RidePageContext } from '../../context/ridePageContext';
import {
  PageContainer,
} from './styled';
import Header from '../../Components/Header';
import MainMap from './map';
import BottomSheet from './RideDrawer/AddressSelector';


const RidePage = ({ menuSide, mapSettings }) => {
  const { loadTerritory } = useContext(RidePageContext);
  const navigation = useNavigation();
  const mapRef = React.useRef();

  useEffect(() => {
    geo.init();
    loadTerritory();
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
