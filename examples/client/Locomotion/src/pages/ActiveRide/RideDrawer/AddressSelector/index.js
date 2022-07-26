import React, {
  useEffect, useContext,
} from 'react';

import {
  useBottomSheet,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import styled from 'styled-components';
import { RIDE_POPUPS } from '../../../../context/newRideContext/utils';
import GenericErrorPopup from '../../../../popups/GenericError';
import i18n from '../../../../I18n';
import AddressRow from './AddressLine';
import SearchBar from './SearchBar';
import { RidePageContext } from '../../../../context/newRideContext';
import { BottomSheetContext, SNAP_POINT_STATES } from '../../../../context/bottomSheetContext';
import { BS_PAGES } from '../../../../context/ridePageStateContext/utils';
import { RideStateContextContext } from '../../../../context/ridePageStateContext';
import { UserContext } from '../../../../context/user';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../context/theme';

const NoHistoryTextContainer = styled.View`
  display: flex;
  align-items: center;
  opacity: .5;
`;
const TakeRide = styled.Text`
  ${FONT_SIZES.H2}
  ${FONT_WEIGHTS.BOLD}
  margin-top: 30px;
  margin-bottom: 20px;
`;
const InfoText = styled.Text`
  ${FONT_SIZES.H2}
  ${FONT_WEIGHTS.REGULAR}
  text-align: center;
`;
const NoHistoryText = () => (
  <NoHistoryTextContainer>
    <TakeRide>
      {i18n.t('addressView.noHistoryHeader')}
    </TakeRide>
    <InfoText>
      {i18n.t('addressView.noHistoryText')}
    </InfoText>
  </NoHistoryTextContainer>
);

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

const WelcomeText = styled.Text`
  ${FONT_SIZES.H1};
  ${FONT_WEIGHTS.SEMI_BOLD};
  align-self: flex-start;
  margin-bottom: 5px;
`;
const AddressSelectorBottomSheet = ({ addressSelectorFocus }) => {
  const userContext = useContext(RidePageContext);
  const { locationGranted, user } = useContext(UserContext);
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

  const getHistoryRows = () => {
    if (!userContext.historyResults.length) {
      return userContext.historyResults.map((h, i) => (
        <AddressRow
          testID={`searchResults_${i}`}
          {...h}
          isHistory
          key={h.placeId}
          onPress={() => {
            userContext.onAddressSelected(h, false, 1);
          }}
        />
      ));
    }
    return (
      <NoHistoryText />
    );
  };
  return (
    <ContentContainer>
      {!isExpanded ? (
        <WelcomeText>
          {i18n.t('addressView.welcomeText', {
            name: user?.firstName,
          })}
        </WelcomeText>
      ) : null}
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
              {locationGranted ? (
                <AddressRow
                  border={false}
                  text={i18n.t('addressView.currentLocation')}
                  icon="location"
                  actionButton
                  onPress={onCurrentLocation}
                />
              ) : null}
              {locationGranted ? (
                <AddressRow
                  border={false}
                  text={i18n.t('addressView.setLocationOnMap')}
                  icon="locationPin"
                  actionButton
                  onPress={onSetLocationOnMap}
                />
              ) : null}
              <BottomSheetScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ overflow: 'visible' }}>
                {
                  userContext.searchResults ? userContext.searchResults.map((h, i) => <AddressRow testID={`searchResults_${i}`} {...h} key={h.placeId} onPress={() => userContext.onAddressSelected(h)} />)
                    : userContext.historyResults.map((h, i) => <AddressRow testID={`searchResults_${i}`} {...h} isHistory key={h.placeId} onPress={() => userContext.onAddressSelected(h)} />)
                }
              </BottomSheetScrollView>
            </>
          )
          : getHistoryRows()
          }
      </HistoryContainer>
      <GenericErrorPopup
        isVisible={userContext.ridePopup === RIDE_POPUPS.FAILED_SERVICE_REQUEST}
        closePopup={() => {
          userContext.setRidePopup(null);
          setIsExpanded(true);
          expand();
        }}
      />
    </ContentContainer>
  );
};

export default AddressSelectorBottomSheet;
