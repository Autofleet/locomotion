import React, {
  useCallback, useEffect, useMemo, useRef, useState, useContext,
} from 'react';
import {
  View, Text, StyleSheet, LayoutAnimation,
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

const InputContainer = styled.View`
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
`;

const Row = styled.View`
    flex: 1;
    ${({ margin }) => margin && `
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

const SearchBar = ({
  isExpanded,
  onFocus = () => null,
  onBack,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectedInputIndex, setSelectedInputIndex] = useState(null);
  const [selectedInputTarget, setSelectedInputTarget] = useState(null);
  const [inputValues, setInputValues] = useState([]);

  const pickupRef = useRef(null);

  const debouncedSearch = React.useRef(
    debounce(async (text, i) => {
      const newValues = [...inputValues];
      newValues[i] = text;
      setSearchTerm(text);
      setInputValues(newValues);
    }, 300),
  ).current;


  const userContext = useContext(RidePageContext);

  useEffect(() => {
    console.log(userContext.requestStopPoints);
  }, [userContext.requestStopPoints]);

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

  const onInputBlur = () => {
    setSearchTerm(null);
  };

  useEffect(() => {
    console.log('searchTerm', searchTerm);
    onSearch(searchTerm);
    /*     if (searchTerm && requestStopPoints[selectedInputIndex]) {
      console.log('innnn');

      const currentSps = requestStopPoints;
      currentSps[selectedInputIndex].description = searchTerm;
      setRequestStopPoints(currentSps);
    } */
  }, [searchTerm]);


  const buildSps = () => userContext.requestStopPoints.map((s, i) => {
    const placeholder = getSpPlaceholder(s);
    const rowProps = i === 0 ? {} : { isExpanded, margin: true };

    return (
      <Row {...rowProps}>
        <BottomSheetInput
          placeholder={i18n.t(placeholder)}
          onChangeText={text => debouncedSearch(text, i)}
          fullBorder
          value={userContext.requestStopPoints[i].description}
          placeholderTextColor="#929395"
          onFocus={(e) => {
            onInputFocus(e.target, i);
          }}
          onBlur={onInputBlur}
          key={`input_${i}`}
        />
      </Row>
    );
  });

  const onBackPress = () => {
    selectedInputTarget.blur();
    onBack();
  };

  return (
    <SearchContainer>
      <BackButton
        isExpanded={isExpanded}
        onBack={onBackPress}
      />
      <InputContainer>
        <Row>
          {buildSps()}
        </Row>
      </InputContainer>
    </SearchContainer>
  );
};

export default SearchBar;
