import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import styled from 'styled-components';
import xIcon from '../../../assets/x.png'

export const AddressInputs = styled.View`
    position: absolute;
    bottom: 0;
    left: 0;
    height:  100%;
    width:  100%;
    background-color: #fff;
`;

export const AddressInputsHeader = styled.SafeAreaView`
    shadow-offset: 0;
    shadow-color: #04214f;
    shadow-opacity: 0.4;
    background-color: #fff;
    overflow: visible;
    height: null;
`;

export const Address = styled.View`
    min-height: 50;
    padding-top: 10;
    padding-bottom: 10;
    padding-start: 24;
    align-items: center;
    flex-direction: row;

    ${({ originRow }) => originRow && `
        border-bottom-color: #f2f2f2;
        border-bottom-Width: 1
    `}
`;

const ResetInputIcon = styled.Image.attrs({ source: xIcon })`
    display: flex;
    margin-top: 4px;

    height: 13px;
    width: 13px;
`
const ResetInputIconContainer = styled.TouchableOpacity`
    display: flex;
    height: 22px;
    width: 20px;
    margin-right: 10px;
    margin-left: 10px;
`;

const AddressTextInputContainer = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
`;

export const AddressTextInput = styled(({ value, onChangeText, ...props }) => {
    const [focus, setFocus] = useState(false);
    return (
        <AddressTextInputContainer>
            <TextInput
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                value={value}
                onChangeText={onChangeText}
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
    background-color: #8ac1ff;
    border-radius: 10;
`;

export const DestinationDot = styled.View`
    width: 10;
    height: 10;
    background-color: #02cc64;
    border-radius: 10;
`;

export const PointsLine = styled.View`
    width: 1;
    flex: 1;
    background-color: #8aecff;
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

export const AddressSearchItemTouchableHighlight = styled.TouchableHighlight`
    border-bottom-color: #f2f2f2;
    border-bottom-width: 1;
`;

export const AddressSearchItem = styled((props) => (
    <AddressSearchItemTouchableHighlight>
        <View {...props} />
    </AddressSearchItemTouchableHighlight>
))`
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
`;

export const AddressSearchItemText = styled.Text`
    padding-top: 18;
    padding-bottom: 18;
    padding-left: 18;
    font-size: 16;
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
