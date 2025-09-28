import React, { useCallback, useContext, useState } from 'react';
import propsTypes from 'prop-types';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import styled from 'styled-components';
import { useFocusEffect } from '@react-navigation/native';
import { Context, ERROR_COLOR } from '../../context/theme';

const MainView = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
`;

const PinCode = ({
  onLastDigit,
  onChange,
  error,
}) => {
  const [digits, setDigits] = useState('');
  const theme = useContext(Context);

  useFocusEffect(
    useCallback(() => {
      setDigits('');
    }, []),
  );
  return (
    <MainView>
      <SmoothPinCodeInput
        testID="pinCode"
        value={digits}
        onTextChange={(code) => {
          setDigits(code);
          onChange(code);
        }}
        onFulfill={onLastDigit}
        cellSpacing={20}
        animated={false}
        autoFocus
        cellStyle={{
          backgroundColor: '#ffffff',
          borderBottomWidth: 2,
          borderColor: error ? ERROR_COLOR : '#333333',
        }}
        textStyle={{
          fontWeight: '600',
          fontSize: 30,
        }}
        cellStyleFocused={{
          color: theme.textColor,
          borderColor: theme.primaryColor,
        }}
        textStyleFocused={{
          color: theme.textColor,
        }}
      />
    </MainView>
  );
};

PinCode.defaultProps = {
  onLastDigit: () => null,
};

PinCode.propTypes = {
  onLastDigit: propsTypes.func,
};

export default PinCode;
