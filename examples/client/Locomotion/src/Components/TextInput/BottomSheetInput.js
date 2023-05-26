import React, { forwardRef } from 'react';
import SvgIcon from '../SvgIcon';
import {
  BottomSheetInput, IconContainer, BottomSheetInputContainer, TouchableIconContainer, RemoveIconContainer,
} from './styled';
import cancel from '../../assets/bottomSheet/cancel.svg';
import deleteIcon from '../../assets/bottomSheet/trash.svg';

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
          height={12}
          width={12}
        />
      </IconContainer>
    </TouchableIconContainer>
    )}
    { props.hasMultiSp && (
    <TouchableIconContainer onPress={() => props.remove && props.remove()}>
      <RemoveIconContainer>
        <SvgIcon
          Svg={deleteIcon}
          stroke="#333"
          fill="#333"
          style={{ opacity: props.remove ? 1 : 0 }}
          height={18}
          width={16}
        />
      </RemoveIconContainer>
    </TouchableIconContainer>
    )}
  </BottomSheetInputContainer>

));

export default BottomSheetInputField;
