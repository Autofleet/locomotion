import React, { forwardRef } from 'react';
import SvgIcon from '../SvgIcon';
import {
  BottomSheetInput, IconContainer, BottomSheetInputContainer, TouchableIconContainer,
} from './styled';
import cancel from '../../assets/bottomSheet/cancel.svg';

const BottomSheetInputField = forwardRef((props, ref) => (
  <BottomSheetInputContainer>
    <BottomSheetInput
      {...props}
      ref={ref}
    />
    {!!props.value && props.value.length > 0 && (
    <TouchableIconContainer onPress={() => {
      if (props.clear) {
        props.clear();
      }
    }}
    >
      <IconContainer>
        <SvgIcon
          Svg={cancel}
          fill="#333"
          stroke="#333"
          height={11}
          width={11}
        />
      </IconContainer>
    </TouchableIconContainer>
    )}
  </BottomSheetInputContainer>
));

export default BottomSheetInputField;
