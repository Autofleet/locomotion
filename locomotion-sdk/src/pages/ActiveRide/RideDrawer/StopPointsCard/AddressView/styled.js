import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import TextInput from '../../../../../Components/TextInput'
import xIcon from '../../../../../assets/x.png';

export const AddressInputs = styled.View`
    height:  300px;
    background-color: #fff;
    width: 100%;
`;

export const AddressInputsHeader = styled.SafeAreaView`
    background-color: #fff;
    overflow: visible;
    height: null;
`;

export const Address = styled.View`
    min-height: 30;
    /* padding-top: 10; */

   /*  padding-start: 24; */
    align-items: center;
    flex-direction: row;


`;

const ResetInputIcon = styled.Image.attrs({ source: xIcon })`
    display: flex;
    margin-top: 4px;

    height: 13px;
    width: 13px;
`;
const ResetInputIconContainer = styled.TouchableOpacity`
    display: flex;
    height: 22px;
    width: 20px;
    margin-right: 10px;
    margin-left: 10px;
    align-self: center;
`;

const AddressTextInputContainer = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
`;

export const StyledInput = styled(TextInput)`
  border-bottom-color: #e2e2e2;
  margin: 0 auto;
  font-size: 12px;
`;

export const AddressTextInput = styled(({
  value, onChangeText, inputRef, ...props
}) => {
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
      {focus && value ? (
        <ResetInputIconContainer onPress={() => onChangeText('')}>
          <ResetInputIcon />
        </ResetInputIconContainer>
      ) : undefined}
    </AddressTextInputContainer>
  );
})`
    font-size: 18;
    color: #666666;
    margin-start: 16;
    min-width: 200;
    display: flex;
    flex: 1;
`;

export const OriginDot = styled.View`
    width: 10;
    height: 10;
    background-color: #6180c0;
    border-radius: 10;
`;

export const DestinationDot = styled.View`
    width: 10;
    height: 10;
    background-color: #08902d;
    border-radius: 10;
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

    ${({ topLine }) => topLine && `
        bottom: -1;
    `}

    ${({ bottomLine }) => bottomLine && `
        top: 0;
    `}

`;

export const AddressSearchItemTouchableOpacity = styled.TouchableOpacity`
    border-bottom-color: #e2e2e2;
    border-bottom-width: 1;
`;

export const AddressSearchItem = styled(({ onPress, ...props }) => (
  <AddressSearchItemTouchableOpacity onPress={onPress}>
    <View {...props} />
  </AddressSearchItemTouchableOpacity>
))`
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
`;

export const AddressSearchItemText = styled.Text`
    padding-top: 10;
    padding-bottom: 10;

    font-size: 12;
    display: flex;
`;

export const DistanceFromAddress = styled.Text`
    display: flex;
    align-self: flex-end;
    padding-right: 10px;
    padding-bottom: 4px;
    font-size: 12px;
    color: grey;
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
  width: ${({ width }) => (width || '18px')};
  height: ${({ height }) => (height || '18px')};
`;
