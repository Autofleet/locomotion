import React, { useState, forwardRef } from 'react';
import { BottomSheetInput } from './styled';

const BottomSheetInputField = forwardRef((props, ref) => (
  <BottomSheetInput
    {...props}
    ref={ref}
  />
));

export default BottomSheetInputField;
