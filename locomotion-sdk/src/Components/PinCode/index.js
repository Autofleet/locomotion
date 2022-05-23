import React, { useContext, useState } from 'react';
import propsTypes from 'prop-types';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import styled from 'styled-components';
import { Context as ThemeContext } from '../../context/theme';

const MainView = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.pageBackgroundColor};
`;

const PinCode = ({
  onLastDigit,
  onChange,
}) => {
  const theme = useContext(ThemeContext);
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
        containerStyle={{
          backgroundColor: theme.pageBackgroundColor,
        }}
        cellStyle={{
          backgroundColor: theme.pageBackgroundColor,
          borderBottomWidth: 2,
          borderColor: 'gray',
        }}
        cellStyleFocused={{
          color: theme.textColor,
          borderColor: theme.isDarkMode ? '#fff' : '#000',
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
