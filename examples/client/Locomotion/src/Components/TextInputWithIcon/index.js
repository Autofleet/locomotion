import React, { forwardRef, useState } from 'react';
import { View } from 'react-native';
import {
  InputIconContainer, InputIcon, Icon,
} from './styled';
import TextInput from '../TextInput';

const TextInputWithIcon = forwardRef((props, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const {
    inputIcon,
    onFocus = () => null,
    onBlur = () => null,
    fullBorder,
    error,
  } = props;

  return (
    <InputIconContainer error={error} isFocused={isFocused} fullBorder>
      <InputIcon>
        <Icon>
          {inputIcon}
        </Icon>
      </InputIcon>
      <View style={{ flex: 1 }}>
        <TextInput
          style={{ textAlign: 'left' }}
          {...props}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => {
            onBlur();
            setIsFocused(false);
          }}
          inputRef={ref}
        />
      </View>
    </InputIconContainer>
  );
});
export default TextInputWithIcon;
