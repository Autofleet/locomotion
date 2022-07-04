import React, { forwardRef } from 'react';
import { TouchableOpacity } from 'react-native';
import SvgIcon from '../SvgIcon';
import { BottomSheetInput, IconContainer } from './styled';
import cancel from '../../assets/bottomSheet/cancel.svg';

const BottomSheetInputField = forwardRef((props, ref) => (
  <>
    <BottomSheetInput
      {...props}
      ref={ref}
    />
    {props.value && props.value.length > 0 && (
    <IconContainer>
      <TouchableOpacity onPress={() => {
        if (props.clear) {
          props.clear();
        }
      }}
      >
        <SvgIcon
          Svg={cancel}
          fill="#333"
          stroke="#333"
          height={10}
          width={10}
        />
      </TouchableOpacity>
    </IconContainer>
    )}
  </>
));

export default BottomSheetInputField;
