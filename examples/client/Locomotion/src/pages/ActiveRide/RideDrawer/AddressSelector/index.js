import React, {
  useEffect, useContext,
} from 'react';
import {
  useBottomSheet,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import styled, { ThemeContext } from 'styled-components';
import SvgIcon from '../../../../Components/SvgIcon';
import { RIDE_POPUPS, formatDistanceByMeasurement } from '../../../../context/newRideContext/utils';
import GenericErrorPopup from '../../../../popups/GenericError';
import i18n from '../../../../I18n';
import AddressRow from './AddressLine';
import SearchBar from './SearchBar';
import { RidePageContext } from '../../../../context/newRideContext';

import { BottomSheetContext, SNAP_POINT_STATES } from '../../../../context/bottomSheetContext';
import { BS_PAGES } from '../../../../context/ridePageStateContext/utils';
import { RideStateContextContext } from '../../../../context/ridePageStateContext';
import { UserContext } from '../../../../context/user';
import { VirtualStationsContext } from '../../../../context/virtualStationsContext';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../context/theme';
import noHistoryIcon from '../../../../assets/bottomSheet/better_eta.svg';

const NoHistoryTextContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  opacity: .5;
  margin-top: 15px;
  justify-content: space-around;
`;

const InfoText = styled.Text`
  ${FONT_SIZES.H2}
  ${FONT_WEIGHTS.REGULAR}
  text-align: center;
  width: 60%;
`;
const NoHistoryText = () => {
  const { primaryColor } = useContext(ThemeContext);
  return (
    <NoHistoryTextContainer>
      <SvgIcon Svg={noHistoryIcon} height={100} width={100} fill={primaryColor} />
      <InfoText>
        {i18n.t('addressView.noHistoryText')}
      </InfoText>
    </NoHistoryTextContainer>
  );
};

const HistoryContainer = styled.View`
  margin-bottom: 10px;
  flex: 1;
  width: 100%;
`;

const ContentContainer = styled.View`
  align-items: center;
  flex-direction: column;
  padding: 0px 30px 40px 30px;

  flex: 1;
`;

const WelcomeText = styled.Text`
  ${FONT_SIZES.H1};
  ${FONT_WEIGHTS.SEMI_BOLD};
  align-self: flex-start;
  margin-bottom: 5px;
`;
const AddressSelectorBottomSheet = ({ addressSelectorFocusIndex }) => {
  const userContext = useContext(RidePageContext);
  const { locationGranted, user } = useContext(UserContext);
  const { stationsList, isStationsEnabled } = useContext(VirtualStationsContext);
  const {
    changeBsPage,
    searchResults,
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
      userContext.initSps();
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
    if (isStationsEnabled && stationsList.length) {
      return userContext.formatStationsList(stationsList).map((h, i) => (
        <AddressRow
          testID={`searchResults_${i}`}
          text={h.text}
          subText={h.subText}
          key={h.externalId}
          onPress={() => {
            userContext.onAddressSelected(h, false, 1);
          }}
        />
      ));
    }

    if (userContext.historyResults.length && !isStationsEnabled) {
      return userContext.historyResults.map((h, i) => (
        <AddressRow
          testID={`historyResults_${i}`}
          {...h}
          isHistory
          key={h.placeId}
          onPress={() => {
            userContext.onAddressSelected(h, false, 1, !isExpanded);
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
        selectedIndex={addressSelectorFocusIndex}
      />
      <HistoryContainer keyboardShouldPersistTaps="handled">
        {isExpanded
          ? (
            <>
              {locationGranted && userContext.addressSearchLabel && userContext.addressSearchLabel !== '' ? (
                <AddressRow
                  border={false}
                  text={userContext.addressSearchLabel}
                  onPress={() => null}
                  label={i18n.t('virtualStations.search.title')}
                />
              ) : null}
              {locationGranted && !isStationsEnabled ? (
                <AddressRow
                  border={false}
                  text={i18n.t('addressView.currentLocation')}
                  icon="location"
                  actionButton
                  onPress={onCurrentLocation}
                />
              ) : null}
              {locationGranted && !isStationsEnabled ? (
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
                  userContext.searchResults && userContext.searchResults.length > 0
                    ? userContext.searchResults.map((h, i) => <AddressRow testID={`searchResults_${i}`} {...h} key={h.placeId} onPress={() => userContext.onAddressSelected(h)} />)
                    : getHistoryRows()
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
        }}
      />
    </ContentContainer>
  );
};

export default AddressSelectorBottomSheet;
