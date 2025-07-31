import React, { useContext, useState } from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Platform, Text, TextInput, TextInputProps, View,
} from 'react-native';
import { Context } from '../../context/theme';
import { styling } from './style';

interface PinCodeProps {
  onLastDigit: (value: string) => void;
  onChange: (value: string) => void;
  error?: boolean;
}

const CELL_COUNT = 4;
const AUTO_COMPLETE = Platform.select<TextInputProps['autoComplete']>({
  android: 'sms-otp',
  default: 'one-time-code',
});

export const PinCode = ({
  onLastDigit,
  onChange,
  error,
}: PinCodeProps) => {
  const [value, setValue] = useState('');
  const theme = useContext(Context);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleChangeText = (text: string) => {
    setValue(text);
    onChange(text);

    if (text.length === CELL_COUNT) {
      onLastDigit(text);
    }
  };

  const styles = styling({ theme });

  return (
    <SafeAreaView style={styles.root}>
      <CodeField
        ref={ref as React.RefObject<TextInput>}
        {...props}
        testID="pinCode"
        value={value}
        onChangeText={handleChangeText}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoFocus
        autoComplete={AUTO_COMPLETE}
        InputComponent={TextInput}
        renderCell={({ index, symbol, isFocused }) => (
          <View
            style={[styles.cellContainer, isFocused && styles.focusCell, error && styles.errorCell]}
            key={`pinCode-${index}`}
            onLayout={getCellOnLayoutHandler(index)}
          >
            <Text style={styles.cell}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};
