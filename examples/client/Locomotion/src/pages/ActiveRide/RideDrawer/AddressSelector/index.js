import React, {
  useEffect, useContext,
} from 'react';
import {
  View,
} from 'react-native';
import {
  BottomSheetView,
  useBottomSheet,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import styled from 'styled-components';
import SafeView from '../../../../Components/SafeView';
import TextInput from '../../../../Components/TextInput';
import i18n from '../../../../I18n';
import AddressRow from './AddressLine';
import SearchBar from './SearchBar';
import { RidePageContext } from '../../../../context/newRideContext';
import { BottomSheetContext } from '../../../../context/bottomSheetContext';

const Container = styled(BottomSheetView)`
  display: flex;
  width: 100%;
`;


const InputContainer = styled.View`
  width: 100%;
  display: flex;
`;

const HistoryContainer = styled.View`
  margin-bottom: 10px;
  flex: 1;
  width: 100%;
`;

const AddressContainer = styled.View`
  padding: 0px 30px 20px 30px;
`;


const AddressActionsText = styled.Text`
    color: ${({ theme }) => theme.primaryColor};
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
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
    isExpanded,
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
      expand();
    }
  };

  const onBack = () => {
    collapse();
  };

  const onCurrentLocation = async () => {
    userContext.setSpCurrentLocation();
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
              />
            </>
          )
          : null}
        <BottomSheetScrollView contentContainerStyle={{ overflow: 'visible' }}>
          {(userContext.searchResults || userContext.historyResults).map(h => <AddressRow {...h} onPress={() => userContext.onAddressSelected(h)} />)}
        </BottomSheetScrollView>
      </HistoryContainer>
    </ContentContainer>

  );
};

export default AddressSelectorBottomSheet;
