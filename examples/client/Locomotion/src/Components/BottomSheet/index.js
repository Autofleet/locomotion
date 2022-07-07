import React, {
  useCallback, useContext, forwardRef, useEffect,
} from 'react';
import BottomSheet, {
  BottomSheetFooter,
} from '@gorhom/bottom-sheet';
import styled from 'styled-components';
import { UserContext } from '../../context/user';
import SquareSvgButton from '../../Components/SquareSvgButton';
import SafeView from '../SafeView';
import { BottomSheetContext } from '../../context/bottomSheetContext';
import targetIcon from '../../assets/target.svg';

const BottomSheetComponent = forwardRef(({
  children,
  enablePanDownToClose = false,
  focusCurrentLocation,
  index = 0,
  closeable = false,
  showCompass = false,
}, ref) => {
  const {
    setIsExpanded,
    snapPoints,
    footerComponent,
    isExpanded,
  } = useContext(BottomSheetContext);
  const { locationGranted } = useContext(UserContext);
  const onAnimate = useCallback((from, to) => {
    if (!closeable && from !== -1) {
      setIsExpanded(to > from);
    } else if (closeable) {
      setIsExpanded(to > from);
    }
  }, []);

  const renderFooter = useCallback(
    props => (
      footerComponent && (
      <BottomSheetFooter {...props} bottomInset={24}>
        {footerComponent}
      </BottomSheetFooter>
      )
    ),
    [footerComponent],
  );

  const snapPointsAreTheSame = () => {
    const firstSnapPoint = snapPoints[0];
    return snapPoints.every(snap => snap === firstSnapPoint);
  };

  return (
    <>
      {!isExpanded && locationGranted && showCompass && (
      <SquareSvgButton
        onPress={focusCurrentLocation}
        icon={targetIcon}
        style={{ position: 'absolute', bottom: `${parseFloat(snapPoints[0]) + 2}%`, right: 20 }}
      />
      )}
      <BottomSheet
        android_keyboardInputMode="adjustResize"
        ref={ref}
        snapPoints={snapPoints}
        onAnimate={onAnimate}
        footerComponent={renderFooter}
        enablePanDownToClose={enablePanDownToClose}
        index={index}
        handleIndicatorStyle={{
          ...(snapPointsAreTheSame() && { display: 'none' }),
        }}
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          zIndex: 5,
        }}
      >
        <SafeView
          style={{
            flex: 1,
            flexDirection: 'column',
          }}
        >
          {children}
        </SafeView>

      </BottomSheet>
    </>
  );
});

export default BottomSheetComponent;
