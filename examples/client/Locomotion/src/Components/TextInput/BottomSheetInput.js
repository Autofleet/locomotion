import React, { forwardRef } from 'react';
import { TouchableOpacity } from 'react-native';
import SvgIcon from '../SvgIcon';
import { BottomSheetInput, IconContainer, BottomSheetInputContainer } from './styled';
import cancel from '../../assets/bottomSheet/cancel.svg';

const BottomSheetInputField = forwardRef((props, ref) => (
  <BottomSheetInputContainer>
    <BottomSheetInput
      {...props}
      ref={ref}
    />
    {!!props.value && !!props.value.length > 0 && (
    <TouchableOpacity onPress={() => {
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
          height={10}
          width={10}
        />
      </IconContainer>
    </TouchableOpacity>

    )}
  </BottomSheetInputContainer>
));

export default BottomSheetInputField;
