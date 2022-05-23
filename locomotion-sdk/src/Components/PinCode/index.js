import React, { useState } from 'react';
import propsTypes from 'prop-types';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import styled from 'styled-components';
import { ERROR_COLOR, OPERATION_COLOR } from '../../services/sharedStyles';

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
          fontSize: 40,
        }}
        cellStyleFocused={{
          borderColor: OPERATION_COLOR,
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
