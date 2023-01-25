import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { Animated, View } from 'react-native';
import styled from 'styled-components';
import { debounce } from 'lodash';
import shortid from 'shortid';
import Mixpanel from '../../../../services/Mixpanel';
import BottomSheetInput from '../../../../Components/TextInput/BottomSheetInput';
import i18n from '../../../../I18n';
import { RidePageContext } from '../../../../context/newRideContext';

import backImage from '../../../../assets/arrow-back.png';
import { UserContext } from '../../../../context/user';


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
    height: 50px;
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
  selectedIndex,
}) => {
  const {
    setSelectedInputIndex,
    selectedInputTarget,
    setSelectedInputTarget,
    requestStopPoints,
    updateRequestSp,
    initSps,
    fillLoadSkeleton,
  } = useContext(RidePageContext);

  const {
    locationGranted,
  } = useContext(UserContext);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useCallback(debounce(async text => onSearch(text), 300), [locationGranted]);

  const getSpPlaceholder = (sp) => {
    if (!isExpanded || !sp.useDefaultLocation) {
      return 'addressView.whereTo';
    }

    if (locationGranted) {
      return 'addressView.enterAddress';
    }

    return '';
  };

  const onInputFocus = (target, index) => {
    setSelectedInputTarget(target);
    setSelectedInputIndex(index);
    onFocus();
  };

  useEffect(() => {
    fillLoadSkeleton();
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  const inputRef = useRef();

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedIndex, isExpanded]);

  const buildSps = () => requestStopPoints.map((s, i) => {
    const { type, description } = requestStopPoints[i];
    const placeholder = getSpPlaceholder(s);
    const rowProps = i === 0 ? { isExpanded } : { setMargin: true };
    const autoFocus = isExpanded && i === selectedIndex;
    return (
      <Row
        {...rowProps}
        key={s.id}
      >
        <BottomSheetInput
          accessible
          accessibilityLabel={`address_input_${i}`}
          placeholder={i18n.t(placeholder)}
          onChangeText={(text) => {
            updateRequestSp({
              description: text,
              lat: null,
              lng: null,
              externalId: null,
            }, i);
            setSearchTerm(text);
          }}
          fullBorder
          value={description || ''}
          placeholderTextColor={isExpanded ? '#929395' : '#333333'}
          onFocus={(e) => {
            Mixpanel.setEvent(`${type} address input focused`);
            onInputFocus(e.target, i);
            e.currentTarget?.setSelection(description?.length, description?.length);
          }}
          key={`input_${s.id}`}
          autoCorrect={false}
          clear={() => {
            updateRequestSp({
              description: null,
              lat: null,
              lng: null,
              externalId: null,
              id: shortid.generate(),
            }, i);
            setSearchTerm(null);
          }}
          ref={(ref) => {
            if (autoFocus) {
              inputRef.current = ref;
            }
          }}
          onLayout={e => e.currentTarget?.setSelection(1, 1)}
          onBlur={(e) => {
            e.currentTarget?.setSelection(1, 1);
          }}
        />
      </Row>
    );
  });

  const onBackPress = useCallback(() => {
    initSps();
    setSearchTerm(null);
    if (selectedInputTarget) {
      selectedInputTarget.blur();
    }
    onBack();
  });


  useEffect(() => {
    if (!isExpanded && selectedInputTarget) {
      selectedInputTarget.blur();
    }
  }, [isExpanded]);

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
