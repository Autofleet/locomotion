import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import styled from 'styled-components';
import TextInput from '../../../../../Components/TextInput';
import xIcon from '../../../../../assets/x.png';
import stationIcon from '../../../../../assets/marker-tip.png';
import Button from '../../../../../Components/Button';

export const AddressInputs = styled.View`
  height: 500px;
  width: 100%;
  padding: 20px 20px 10px 20px;
`;

export const AddressInputsHeader = styled.SafeAreaView`
  background-color: #fff;
  overflow: visible;
  height: null;
`;

export const Address = styled.View`
  height: 30;
  /* padding-top: 10; */

  /*  padding-start: 24; */
  align-items: center;
  flex-direction: row;
  padding-top: 0px;
`;

export const ResetInputIcon = styled.Image.attrs({source: xIcon})`
  display: flex;
  height: 13px;
  width: 13px;
`;
export const ResetInputIconContainer = styled(Button)`
  height: 22px;
  width: 22px;
  position: absolute;
  right: 5px;
  top: 5px;
  align-self: center;
  align-items: center;
  justify-content: center;
`;

const AddressTextInputContainer = styled.View`
  flex-direction: row;
  width: 100%;
`;

export const StyledInput = styled(TextInput)`
  border-bottom-color: #e2e2e2;
`;

export const AddressTextInput = styled(
  ({value, onChangeText, inputRef, ...props}) => {
    const [focus, setFocus] = useState(false);
    return (
      <AddressTextInputContainer>
        <StyledInput
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          value={value}
          onChangeText={onChangeText}
          ref={inputRef}
          {...props}
        />
      </AddressTextInputContainer>
    );
  },
)`
  font-size: 14;
  color: #666666;
  width: 100%;
  display: flex;
  flex: 1;
  margin: 0;
  height: 30px;
`;

export const OriginDot = styled.View`
  width: 10px;
  height: 10px;
  background-color: #6180c0;
  border-radius: 10px;
`;

export const DestinationDot = styled.View`
  width: 10px;
  height: 10px;
  background-color: #08902d;
  border-radius: 10px;
`;

export const PointsLine = styled.View`
  width: 2;
  flex: 1;
  background-color: #dbdbdb;
`;

export const RoutePointsContainer = styled.View`
  position: absolute;
  left: 16;

  justify-content: center;
  align-items: center;
  width: 20;
  height: 100%;

  ${({topLine}) =>
    topLine &&
    `
        bottom: -1;
    `}

  ${({bottomLine}) =>
    bottomLine &&
    `
        top: 0;
    `}
`;

export const AddressSearchItemTouchableOpacity = styled(Button)`
  border-bottom-color: #e2e2e2;
  border-bottom-width: 1;
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const AddressSearchItem = styled(({onPress, ...props}) => (
  <AddressSearchItemTouchableOpacity
    onPress={onPress}
    data-test-id="AddressSearchItemButton">
    <View {...props} />
  </AddressSearchItemTouchableOpacity>
))`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export const AddressSearchItemText = styled.Text`
  padding-left: 8px;
  font-size: 12px;
  display: flex;
`;

export const DistanceFromAddress = styled.Text`
  display: flex;
  align-self: flex-end;
  font-size: 12px;
  color: grey;
  align-items: center;
`;

export const HeaderContainer = styled.View`
  text-align: center;
  padding: 15px;
  background-color: #ffffff;
  height: 20px;
  width: 100%;
`;

export const HeaderIconContainer = styled.TouchableOpacity`
  padding: 5px;
  position: absolute;
  left: 0;
  margin-left: 10;
`;

export const HeaderIcon = styled.Image`
  width: ${({width}) => width || '18px'};
  height: ${({height}) => height || '18px'};
`;

export const StationIcon = styled.Image.attrs({source: stationIcon})`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16px;
  width: 16px;
  margin-start: 8px;
`;
