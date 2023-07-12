import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import {
  Animated, View,
} from 'react-native';
import styled from 'styled-components';
import { debounce } from 'lodash';
import shortid from 'shortid';
import DraggableFlatList from 'react-native-draglist';
import { STOP_POINT_TYPES } from '../../../../lib/commonTypes';
import { UserContext } from '../../../../context/user';
import settings from '../../../../context/settings';
import Mixpanel from '../../../../services/Mixpanel';
import BottomSheetInput from '../../../../Components/TextInput/BottomSheetInput';
import i18n from '../../../../I18n';
import { RidePageContext } from '../../../../context/newRideContext';
import backImage from '../../../../assets/arrow-back.png';
import SETTINGS_KEYS from '../../../../context/settings/keys';

const { STOP_POINT_DROPOFF, STOP_POINT_PICKUP } = STOP_POINT_TYPES;
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
    if (index === 0) {
      return 'addressView.enterAddress';
    }
    return 'addressView.whereTo';
  };


  const onInputFocus = (target, index) => {
    setSelectedInputTarget(target);
    setSelectedInputIndex(index);
    onFocus();
  };

  const loadMultiSpSetting = async () => {
    const multiSpSetting = await getSettingByKey(SETTINGS_KEYS.MULTI_SP);
    if (multiSpSetting && multiSpSetting.enabled) {
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
  const formatMovedMultiSps = (sps) => {
    const newSps = [...sps];
    return newSps.map((sp, index) => {
      const type = index === newSps.length - 1 ? STOP_POINT_DROPOFF : STOP_POINT_PICKUP;
      return {
        ...sp,
        type,
      };
    });
  };
  const renderDraggableItem = ({
    onStartDrag, item, onEndDrag,
  }) => {
    const index = requestStopPoints.indexOf(item);
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
          index={index}
          placeholder={i18n.t(placeholder)}
          onDrag={hasEnteredMultiSp ? onStartDrag : null}
          onEndDrag={hasEnteredMultiSp ? onEndDrag : null}
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
            Mixpanel.setEvent('address input focused', { index, type });
            onInputFocus(e.target, index);
          }}
          isMultiSpEnabled={isMultiSpEnabled}
          hasEnteredMultiSp={hasEnteredMultiSp}
          onPressIn={e => e.currentTarget?.setSelection((description?.length || 0), (description?.length || 0))}
          key={`input_${sp.id}`}
          autoCorrect={false}
          clear={() => {
            Mixpanel.setEvent('address input cleared', { index, type });
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
          remove={isSpIndexMulti(index) ? () => {
            removeRequestSp(index);
            Mixpanel.setEvent('sp removed by trash can click', { index, type });
          } : null}
          add={canAddMoreMultiSp
      && index === amountOfEnteredSp - 1 ? () => {
              addNewEmptyRequestSp();
              Mixpanel.setEvent('sp added by plus click', { index, type });
            }
            : null}
          onLayout={(e) => {
            if (e.currentTarget?.setSelection) {
              e.currentTarget?.setSelection(1, 1);
            }
          }
          }
          onBlur={(e) => {
            if (e.currentTarget?.setSelection) {
              e.currentTarget?.setSelection(1, 1);
            }
          }}
        />
      </Row>


    );
  };
  const buildSps = () => (
    <DraggableFlatList
      data={requestStopPoints}
      scrollEnabled={false}
      renderItem={renderDraggableItem}
      keyExtractor={item => item.id}
      keyboardShouldPersistTaps="always"
      onReordered={(fromIndex, toIndex) => {
        const newSps = [...requestStopPoints];
        const removed = newSps.splice(fromIndex, 1);
        newSps.splice(toIndex, 0, removed[0]);
        const formattedMovedStopPoints = formatMovedMultiSps(newSps);
        setRequestStopPoints(formattedMovedStopPoints);
        Mixpanel.setEvent('finished drag multi sps', { formattedMovedStopPoints });
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
