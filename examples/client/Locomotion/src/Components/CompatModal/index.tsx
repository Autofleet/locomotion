import React from 'react';
import {
  BackHandler,
  Platform,
  Pressable,
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { Portal } from '@gorhom/portal';

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
  React.useEffect(() => {
    if (!isVisible || Platform.OS !== 'android') return undefined;
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      const cb = onBackButtonPress || onBackdropPress;
      if (cb) {
        cb();
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [isVisible, onBackButtonPress, onBackdropPress]);

  if (!isVisible) {
    return null;
  }

  return (
    <Portal>
      <View style={styles.fill} pointerEvents="box-none">
        <Pressable
          style={styles.backdrop}
          onPress={onBackdropPress}
        />
        <View style={[styles.overlay, style]} pointerEvents="box-none">
          {children}
        </View>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
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
