import React, {
  useEffect, useContext,
} from 'react';

import {
  BottomSheetView,
  useBottomSheet,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import styled from 'styled-components';
import i18n from '../../../../I18n';
import AddressRow from './AddressLine';
import SearchBar from './SearchBar';
import { RidePageContext } from '../../../../context/newRideContext';
import { BottomSheetContext, SNAP_POINT_STATES } from '../../../../context/bottomSheetContext';
import { BS_PAGES } from '../../../../context/ridePageStateContext/utils';
import { RideStateContextContext } from '../../../../context/ridePageStateContext';

const HistoryContainer = styled.View`
  margin-bottom: 10px;
  flex: 1;
  width: 100%;
`;

const ContentContainer = styled.View`
  align-items: center;
  flex-direction: column;
  padding: 0px 30px 40px 30px;
  width: 100%;
  flex: 1;

`;
const AddressSelectorBottomSheet = () => {
  const userContext = useContext(RidePageContext);

  const {
    setCurrentBsPage,
  } = useContext(RideStateContextContext);

  const {
    isExpanded,
    setSnapPointsState,
  } = useContext(BottomSheetContext);

  const { expand, collapse } = useBottomSheet();


  const loadHistory = async () => {
    userContext.loadHistory();
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const onSearchFocus = () => {
    if (!isExpanded) {
      setSnapPointsState(SNAP_POINT_STATES.ADDRESS_SELECTOR);
      expand();
    }
  };

  const onBack = () => {
    collapse();
  };

  const onCurrentLocation = async () => {
    userContext.setSpCurrentLocation();
  };

  const onSetLocationOnMap = async () => {
    setCurrentBsPage(BS_PAGES.SET_LOCATION_ON_MAP);
    collapse();
  };
  return (
    <ContentContainer>
      <SearchBar
        onFocus={onSearchFocus}
        isExpanded={isExpanded}
        onBack={onBack}
        onSearch={userContext.searchAddress}
      />
      <HistoryContainer>
        {isExpanded
          ? (
            <>
              <AddressRow
                border={false}
                text={i18n.t('addressView.currentLocation')}
                icon="location"
                actionButton
                onPress={onCurrentLocation}
              />
              <AddressRow
                border={false}
                text={i18n.t('addressView.setLocationOnMap')}
                icon="locationPin"
                actionButton
                onPress={onSetLocationOnMap}
              />
              <BottomSheetScrollView contentContainerStyle={{ overflow: 'visible' }}>
                {(userContext.searchResults || userContext.historyResults).map(h => <AddressRow {...h} onPress={() => userContext.onAddressSelected(h)} />)}
              </BottomSheetScrollView>
            </>
          )
          : null}
      </HistoryContainer>
    </ContentContainer>

  );
};

export default AddressSelectorBottomSheet;
