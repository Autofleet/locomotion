import React, { forwardRef } from 'react';
import { View } from 'react-native';
import SvgIcon from '../SvgIcon';
import {
  BottomSheetInput,
  IconContainer,
  BottomSheetInputContainer,
  TouchableIconContainer,
  RemoveIconContainer,
  AddSpContainer,
  PlusIcon,
  DragIconContainer,
  TextDragCloseContainer,
  DragTouchableIconContainer,
} from './styled';
import cancel from '../../assets/bottomSheet/cancel.svg';
import dragIcon from '../../assets/bottomSheet/drag-icon.svg';
import deleteIcon from '../../assets/bottomSheet/trash.svg';

const AddSpButton = ({ onLongPress, hasEnteredMultiSp, onPress }) => (
  <AddSpContainer hasEnteredMultiSp={hasEnteredMultiSp} onPress={onPress} onLongPress={onLongPress} testID="addSpButton">
    <PlusIcon />
  </AddSpContainer>
);
const BottomSheetInputField = forwardRef((props, ref) => (

  <BottomSheetInputContainer>

    <TextDragCloseContainer
      {...props}
    >
      <BottomSheetInput
        dragIsRendered={!!props.onDrag}
        clearIsRendered={!!props.value && props.value.length > 0 && props.clear}
        {...props}
        ref={ref}
      />


      { !!props.value && props.value.length > 0 && props.clear && (
        <TouchableIconContainer
          marginLeft={props.isMultiSpEnabled && 20}
          onPress={() => {
            props.clear();
          }}
        >


          <SvgIcon
            Svg={cancel}
            fill="#333"
            stroke="#333"
            height={12}
            width={12}
          />


        </TouchableIconContainer>
      )}


      { props.onDrag && (
      <DragTouchableIconContainer
        onPressIn={() => props.onDrag()}
        onPressOut={() => props.onEndDrag()}
      >
        <DragIconContainer>
          <SvgIcon
            Svg={dragIcon}
            stroke="#333"
            fill="#333"
            height={25}
            width={15}
          />
        </DragIconContainer>
      </DragTouchableIconContainer>
      )}
    </TextDragCloseContainer>
    { props.add && (
    <AddSpButton hasEnteredMultiSp onPress={() => props.add()} />
    )}

    { props.remove && (
    <TouchableIconContainer marginLeft={15} onPress={() => props.remove()}>
      <RemoveIconContainer>
        <SvgIcon
          Svg={deleteIcon}
          stroke="#333"
          fill="#333"
          height={19}
          width={19}
        />
      </RemoveIconContainer>
    </TouchableIconContainer>
    )}


  </BottomSheetInputContainer>

));

export default BottomSheetInputField;
