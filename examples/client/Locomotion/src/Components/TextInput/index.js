import React, { forwardRef, useState } from 'react';
import { View } from 'react-native';
import {
  Input, InputIconContainer, InputIcon, Icon,
} from './styled';

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


export const TextInputWithIcon = forwardRef((props, ref) => {
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
export default TextInput;
