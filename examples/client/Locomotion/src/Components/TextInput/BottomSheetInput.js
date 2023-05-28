import React, { forwardRef } from 'react';
import SvgIcon from '../SvgIcon';
import {
  BottomSheetInput,
  IconContainer,
  BottomSheetInputContainer,
  TouchableIconContainer,
  RemoveIconContainer,
  AddSpContainer,
  PlusIcon,
} from './styled';
import cancel from '../../assets/bottomSheet/cancel.svg';
import deleteIcon from '../../assets/bottomSheet/trash.svg';

const AddSpButton = ({ onPress }) => (
  <AddSpContainer isFirstSp onPress={onPress} testID="addSpButton">
    <PlusIcon />
  </AddSpContainer>
);
const BottomSheetInputField = forwardRef((props, ref) => (
  <BottomSheetInputContainer>

    <BottomSheetInput
      hasMultiSp={props.hasMultiSp}
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
    { props.add && (
      <AddSpButton onPress={() => props.add()} />
    )}
    { props.remove && (
    <TouchableIconContainer onPress={() => props.remove()}>
      <RemoveIconContainer>
        <SvgIcon
          Svg={deleteIcon}
          stroke="#333"
          fill="#333"
          style={{ opacity: props.remove ? 1 : 0 }}
          height={19}
          width={19}
        />
      </RemoveIconContainer>
    </TouchableIconContainer>
    )}
  </BottomSheetInputContainer>

));

export default BottomSheetInputField;
