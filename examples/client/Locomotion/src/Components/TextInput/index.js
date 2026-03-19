import React, { useState } from 'react';
import {
  Input,
} from './styled';

function TextInput(props) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <Input
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      isFocused={isFocused}
      ref={props.inputRef}
      {...props}
      testID={props.testID || null}
    />
  );
}

export default TextInput;
