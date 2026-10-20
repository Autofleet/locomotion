import React from 'react';
import {
  BackHandler,
  Modal,
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

const isAndroidOverlay = Platform.OS === 'android';

function CompatModal({
  isVisible,
  children,
  onBackButtonPress,
  onBackdropPress,
  style,
}: CompatModalProps) {
  const onCloseRef = React.useRef(onBackButtonPress || onBackdropPress);
  onCloseRef.current = onBackButtonPress || onBackdropPress;

  React.useEffect(() => {
    if (!isAndroidOverlay || !isVisible) return undefined;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onCloseRef.current?.();
      return true;
    });
    return () => subscription.remove();
  }, [isVisible]);

  const content = (
    <View style={isAndroidOverlay ? styles.portalFill : styles.fill} pointerEvents="box-none">
      <Pressable
        style={styles.backdrop}
        onPress={onBackdropPress}
      />
      <View style={[styles.overlay, style]} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );

  if (isAndroidOverlay) {
    return isVisible ? <Portal>{content}</Portal> : null;
  }

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onBackButtonPress || onBackdropPress}
    >
      {content}
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  portalFill: {
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
