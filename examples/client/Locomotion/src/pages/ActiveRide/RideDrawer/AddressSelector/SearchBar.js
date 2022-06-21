import React, {
  useCallback, useEffect, useMemo, useRef, useState, useContext,
} from 'react';
import {
  View, Text, StyleSheet, LayoutAnimation, Animated, Platform, UIManager,
} from 'react-native';
import styled from 'styled-components';
import { debounce } from 'lodash';
import BottomSheetInput from '../../../../Components/TextInput/BottomSheetInput';
import i18n from '../../../../I18n';
import { RidePageContext } from '../../../../context/newRideContext';

const backImage = require('../../../../assets/arrow-back.png');


const SearchContainer = styled.View`
    flex: 1;
    padding-bottom: 12px;
    flex-direction: row;
    border-bottom-color: #f1f2f6;
    border-bottom-width: 2px;
  `;

const InputContainer = styled(View)`
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
`;

const Row = styled(Animated.View)`
    ${({ setMargin }) => setMargin && `
        margin-top: 12px;
    `}

    ${({ isExpanded }) => isExpanded === false && `
        display: none;
    `}

`;


const BackButtonContainer = styled.TouchableOpacity`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background-color: #f1f2f6;
    margin-right: 8px;
    justify-content: center;
    align-items: center;

`;

const ArrowImage = styled.Image.attrs({ source: backImage })`
    width: 25px;
    height: 25px;
`;

const BackButton = ({ isExpanded, onBack }) => {
  if (!isExpanded) {
    return null;
  }
  return (
    <BackButtonContainer onPress={onBack}>
      <ArrowImage />
    </BackButtonContainer>
  );
};

/* if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
} */

const SearchBar = ({
  isExpanded,
  onFocus = () => null,
  onBack,
  onSearch,
}) => {
  const {
    searchTerm,
    setSearchTerm,
    selectedInputIndex,
    setSelectedInputIndex,
    selectedInputTarget,
    setSelectedInputTarget,
    requestStopPoints,
    updateRequestSp,
    validateRequestedStopPoints,
  } = useContext(RidePageContext);

  const pickupRef = useRef(null);

  const debouncedSearch = React.useRef(
    debounce(async (text, i) => {
      onSearch(text);
    }, 300),
  ).current;


  const getSpPlaceholder = (sp) => {
    if (!isExpanded || !sp.useDefaultLocation) {
      return 'addressView.whereTo';
    }

    return 'addressView.currentLocation';
  };

  const onInputFocus = (target, index) => {
    setSelectedInputTarget(target);
    setSelectedInputIndex(index);
    onFocus();
  };

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm]);


  const buildSps = () => requestStopPoints.map((s, i) => {
    const placeholder = getSpPlaceholder(s);
    const rowProps = i === 0 ? { isExpanded } : { setMargin: true };
    return (
      <Row
        {...rowProps}
        key={s.id}
      >
        <BottomSheetInput
          placeholder={i18n.t(placeholder)}
          onChangeText={(text) => {
            updateRequestSp({ description: text });
            setSearchTerm(text);
          }}
          fullBorder
          value={requestStopPoints[i].description}
          placeholderTextColor="#929395"
          onFocus={(e) => {
            onInputFocus(e.target, i);
          }}
          key={`input_${s.id}`}
          autoCorrect={false}
        />
      </Row>
    );
  });

  const onBackPress = () => {
    setSearchTerm(null);
    if (selectedInputTarget) {
      selectedInputTarget.blur();
    }
    onBack();
  };


  /*   useEffect(() => {
    if (isExpanded) {
      LayoutAnimation.configureNext(
        LayoutAnimation.Presets.spring,
      );
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.create(
        200,
        LayoutAnimation.Presets.easeOut,
        LayoutAnimation.Properties.scaleXY,
      ));
      if (selectedInputTarget) {
        selectedInputTarget.blur();
      }
    }
  }, [isExpanded]); */

  return (
    <View
      style={{
        paddingBottom: 12,
        flexDirection: 'row',
        borderBottomColor: '#f1f2f6',
        borderBottomWidth: 2,
      }}
    >
      {isExpanded
        ? (
          <BackButton
            isExpanded
            onBack={onBackPress}
          />
        ) : null}
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
        }}
      >

        {buildSps()}

      </View>
    </View>
  );
};

export default SearchBar;
