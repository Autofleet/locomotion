import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Input,
} from './styled';

const styles = StyleSheet.create({
  customHandle: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    height: 30,
    borderRadius: 18, // For rounded top corners
    backgroundColor: 'cyan', // Default color
    transform: [{ translateY: 20 }],
    borderBottomLeftRadius: 12, // Larger radius for the bottom to create a drop effect
    borderBottomRightRadius: 12,
  },
});
const TextInput = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  return (
    <>
      <Input
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        isFocused={isFocused}
        ref={props.inputRef}
        {...props}
        testID={props.testID || null}
        selection={selection}
        onSelectionChange={({ nativeEvent }) => setSelection(nativeEvent.selection)}
      />
      <View style={[styles.customHandle, { left: selection.start * 8 }]} />
      <View style={[styles.customHandle, { left: selection.end * 8 }]} />
    </>
  );
};

export default TextInput;
