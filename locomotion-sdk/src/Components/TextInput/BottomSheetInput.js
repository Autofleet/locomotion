import React, { useState, forwardRef } from 'react';
import { TextInput } from 'react-native';
import { BottomSheetInput } from './styled';

const BottomSheetInputField = forwardRef((props, ref) => (
  <BottomSheetInput
    {...props}
    ref={ref}
  />
));

export default BottomSheetInputField;
