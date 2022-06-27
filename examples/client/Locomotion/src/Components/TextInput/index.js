import React, { useState } from 'react';
import { View } from 'react-native';
import { Input, InputIconContainer, InputIcon } from './styled';

const TextInput = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <Input
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      isFocused={isFocused}
      ref={props.inputRef}
      {...props}
    />
  );
};


export const TextInputWithIcon = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const {
    children,
    onFocus,
    fullBorder,
  } = props;

  return (
    <InputIconContainer isFocused={isFocused} fullBorder={fullBorder}>
      <InputIcon>
        {children}
      </InputIcon>
      <View style={{ flex: 1 }}>
        <TextInput
          style={{ textAlign: 'left' }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          ref={props.inputRef}
          {...props}
        />
      </View>
    </InputIconContainer>
  );
};
export default TextInput;

// width: ${({ width }) => (width || '100%')};
// border-bottom-width: 1px;
// margin: 15px auto;
// ${({ theme }) => `
//     border-bottom-color: ${theme.isDarkMode ? '#fff' : '#e2e2e2'};
//     color: ${theme.textColor};
//     ${commonInputStyleWithTheme(theme)}
//   `}
// `;
