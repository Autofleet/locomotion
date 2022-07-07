import React, {
  useEffect, useContext,
} from 'react';

import {
  BottomSheetView,
  useBottomSheet,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import styled from 'styled-components';
import { STOP_POINT_TYPES } from '../../../../lib/commonTypes';
import GenericErrorPopup from '../../../../popups/GenericError';
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
const AddressSelectorBottomSheet = ({ addressSelectorFocus }) => {
  const userContext = useContext(RidePageContext);

  const {
    changeBsPage,
  } = useContext(RideStateContextContext);

  const {
    isExpanded,
    setSnapPointsState,
    setIsExpanded,
  } = useContext(BottomSheetContext);

  const { expand, collapse } = useBottomSheet();


  const loadHistory = async () => {
    userContext.loadHistory();
  };

  const onSearchFocus = () => {
    if (!isExpanded) {
      setSnapPointsState(SNAP_POINT_STATES.ADDRESS_SELECTOR);
      setIsExpanded(true);
      expand();
    }
  };

  useEffect(() => {
    loadHistory();
    if (userContext.serviceRequestFailed) {
      setIsExpanded(true);
      setSnapPointsState(SNAP_POINT_STATES.ADDRESS_SELECTOR);
      expand();
    }
  }, []);

  const onBack = () => {
    collapse();
  };

  const onCurrentLocation = async () => {
    userContext.setSpCurrentLocation();
  };

  const onSetLocationOnMap = async () => {
    changeBsPage(BS_PAGES.SET_LOCATION_ON_MAP);
    collapse();
  };
  return (
    <ContentContainer>
      <SearchBar
        onFocus={onSearchFocus}
        isExpanded={isExpanded}
        onBack={onBack}
        onSearch={userContext.searchAddress}
        isSelected={addressSelectorFocus}
      />
      <HistoryContainer keyboardShouldPersistTaps="handled">
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
              <BottomSheetScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ overflow: 'visible' }}>
                {
                  userContext.searchResults ? userContext.searchResults.map(h => <AddressRow {...h} key={h.placeId} onPress={() => userContext.onAddressSelected(h)} />)
                    : userContext.historyResults.map(h => <AddressRow {...h} isHistory key={h.placeId} onPress={() => userContext.onAddressSelected(h)} />)
                }
              </BottomSheetScrollView>
            </>
          )
          : null}
      </HistoryContainer>
      <GenericErrorPopup
        isVisible={userContext.serviceRequestFailed}
        closePopup={() => userContext.setServiceRequestFailed(false)}
      />
    </ContentContainer>
  );
};

export default AddressSelectorBottomSheet;
