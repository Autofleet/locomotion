import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import {
  Animated, View, Text, TouchableOpacity,
} from 'react-native';
import styled from 'styled-components';
import { debounce, remove } from 'lodash';
import shortid from 'shortid';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { UserContext } from '../../../../context/user';
import settings from '../../../../context/settings';
import Mixpanel from '../../../../services/Mixpanel';
import BottomSheetInput from '../../../../Components/TextInput/BottomSheetInput';
import i18n from '../../../../I18n';
import { RidePageContext } from '../../../../context/newRideContext';
import plusImage from '../../../../assets/plus.png';
import backImage from '../../../../assets/arrow-back.png';
import SETTINGS_KEYS from '../../../../context/settings/keys';

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
    <BackButtonContainer onPress={onBack} testID="backButton">
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
    setRequestStopPoints,
    initSps,
    fillLoadSkeleton,
    addNewEmptyRequestSp,
    removeRequestSp,
  } = useContext(RidePageContext);
  const { getSettingByKey } = settings.useContainer();
  const {
    locationGranted,
  } = useContext(UserContext);
  const SP_AMOUNT_WITHOUT_MULTI = 2;
  const [searchTerm, setSearchTerm] = useState('');
  const [multiSpAmount, setMultiSpAmount] = useState(0);
  const debouncedSearch = useCallback(debounce(async text => onSearch(text), 300), [locationGranted]);
  const isMultiSpEnabled = multiSpAmount > 0 && isExpanded;
  const amountOfEnteredSp = requestStopPoints.length;
  const canAddMoreMultiSp = isMultiSpEnabled
  && amountOfEnteredSp < multiSpAmount + SP_AMOUNT_WITHOUT_MULTI;
  const hasEnteredMultiSp = amountOfEnteredSp > SP_AMOUNT_WITHOUT_MULTI;
  const isSpIndexMulti = i => hasEnteredMultiSp && i > 0 && i < amountOfEnteredSp - 1;
  const getSpPlaceholder = (sp, index) => {
    if (isSpIndexMulti(index)) {
      return 'addressView.multiStopPlaceholder';
    }
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
  const loadMultiSpSetting = async () => {
    const multiSpSetting = await getSettingByKey(SETTINGS_KEYS.MULTI_SP);
    console.log('multi sp setting', multiSpSetting);
    if (multiSpSetting && multiSpSetting.enabled) {
      console.log('multi sp setting', multiSpSetting.amount);
      setMultiSpAmount(multiSpSetting.amount);
    }
  };
  useEffect(() => {
    loadMultiSpSetting();
  }, []);
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
  const renderDraggableItem = ({
    getIndex, drag,
  }) => {
    const index = getIndex();
    const sp = requestStopPoints[index];
    const { type, description } = sp;
    const placeholder = getSpPlaceholder(sp, index);
    const rowProps = index === 0 ? { isExpanded } : { setMargin: true };
    const autoFocus = isExpanded && index === selectedIndex;
    return (


      <Row
        {...rowProps}
        key={sp.id}
      >

        <BottomSheetInput
          accessible
          accessibilityLabel={`address_input_${index}`}
          placeholder={i18n.t(placeholder)}
          onDrag={drag}
          onChangeText={(text) => {
            updateRequestSp({
              description: text,
              lat: null,
              lng: null,
              externalId: null,
            }, index);
            setSearchTerm(text);
          }}
          fullBorder
          value={description || ''}
          placeholderTextColor={isExpanded ? '#929395' : '#333333'}
          onFocus={(e) => {
            Mixpanel.setEvent(`${type} address input focused`);
            onInputFocus(e.target, index);
          }}
          isMultiSpEnabled={isMultiSpEnabled}
          hasEnteredMultiSp={hasEnteredMultiSp}
          onPressIn={e => e.currentTarget?.setSelection((description?.length || 0), (description?.length || 0))}
          key={`input_${sp.id}`}
          autoCorrect={false}
          clear={() => {
            updateRequestSp({
              description: null,
              lat: null,
              lng: null,
              externalId: null,
              id: shortid.generate(),
            }, index);
            setSearchTerm(null);
          }}
          ref={(ref) => {
            if (autoFocus) {
              inputRef.current = ref;
            }
          }}
          remove={isSpIndexMulti(index) ? () => removeRequestSp(index) : null}
          add={canAddMoreMultiSp
      && index === amountOfEnteredSp - 1 ? () => addNewEmptyRequestSp()
            : null}
          onLayout={e => e.currentTarget?.setSelection(1, 1)}
          onBlur={(e) => {
            e.currentTarget?.setSelection(1, 1);
          }}
        />
      </Row>


    );
  };
  const buildSps = () => (
    <DraggableFlatList
      data={requestStopPoints}
      renderItem={renderDraggableItem}
      keyExtractor={item => item.id}
      onDragBegin={() => console.log('drag begin!!')}
      onScrollBeginDrag={() => console.log('scroll begin drag')}
      onDragEnd={({ data }) => {
        console.log('drag enddd!!!', data);
        setRequestStopPoints(data);
      }
          }
    />
  );


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
