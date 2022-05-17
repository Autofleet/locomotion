import React, { useState } from 'react';
import propsTypes from 'prop-types';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import styled from 'styled-components';

const MainView = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
`;

const PinCode = ({
  onLastDigit,
  onChange,
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
        cellSpacing={32}
        animated={false}
        autoFocus
        cellStyle={{
          backgroundColor: '#ffffff',
          borderBottomWidth: 2,
          borderColor: 'gray',
        }}
        cellStyleFocused={{
          borderColor: 'black',
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
