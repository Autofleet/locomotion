import React, {
  useCallback, useContext, forwardRef,
} from 'react';
import BottomSheet, {
  BottomSheetView,
  BottomSheetFooter,
} from '@gorhom/bottom-sheet';
import styled from 'styled-components';
import SquareSvgButton from '../../Components/SquareSvgButton';
import SafeView from '../SafeView';
import { BottomSheetContext } from '../../context/bottomSheetContext';
import targetIcon from '../../assets/target.svg';

const BottomSheetComponent = forwardRef(({ children, focusCurrentLocation }, ref) => {
  const {
    setIsExpanded,
    snapPoints,
    footerComponent,
    isExpanded,
  } = useContext(BottomSheetContext);

  const onAnimate = useCallback((from, to) => {
    if (from !== -1) {
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

  return (
    <>
      <SquareSvgButton
        onPress={focusCurrentLocation}
        icon={targetIcon}
        style={{ position: 'absolute', bottom: `${parseFloat(snapPoints[isExpanded ? 1 : 0]) + 2}%`, right: 20 }}
      />
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        onAnimate={onAnimate}
        footerComponent={renderFooter}
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
