import React, {
  useCallback, useContext, forwardRef, useEffect,
} from 'react';
import BottomSheet, {
  BottomSheetFooter,
} from '@gorhom/bottom-sheet';
import styled from 'styled-components';
import { UserContext } from '../../context/user';
import SafeView from '../SafeView';
import { BottomSheetContext } from '../../context/bottomSheetContext';

const BottomSheetComponent = forwardRef(({
  children,
  enablePanDownToClose = false,
  index = 0,
  closeable = false,
}, ref) => {
  const {
    setIsExpanded,
    snapPoints,
    footerComponent,
  } = useContext(BottomSheetContext);
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
    return snapPoints.every(snap => Math.round(parseFloat(snap)) === Math.round(parseFloat(firstSnapPoint)));
  };

  return (
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
  );
});

export default BottomSheetComponent;
