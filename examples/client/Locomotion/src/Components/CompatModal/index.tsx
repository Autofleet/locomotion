import React from 'react';
import {
  Modal, View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';

interface CompatModalProps {
  isVisible: boolean;
  children: React.ReactNode;
  onBackButtonPress?: () => void;
  onBackdropPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

function CompatModal({
  isVisible,
  children,
  onBackButtonPress,
  onBackdropPress,
  style,
}: CompatModalProps) {
  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onBackButtonPress || onBackdropPress}
    >
      <View style={[styles.overlay, style]}>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: '5%',
  },
});

export default CompatModal;
