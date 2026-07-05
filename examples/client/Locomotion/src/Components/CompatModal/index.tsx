import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
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
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onBackButtonPress || onBackdropPress}
    >
      <View style={styles.fill} pointerEvents="box-none">
        <Pressable
          style={styles.backdrop}
          onPress={onBackdropPress}
        />
        <View style={[styles.overlay, style]} pointerEvents="box-none">
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },
});

export default CompatModal;
