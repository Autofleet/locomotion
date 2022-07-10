import React, { useState } from 'react';
import {
  Input,
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

export default TextInput;
