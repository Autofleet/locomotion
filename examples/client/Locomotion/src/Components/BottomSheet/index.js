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

const ContentContainer = styled(BottomSheetView)`
  flex: 1;
`;

const BottomSheetComponent = forwardRef(({
  children,
  enablePanDownToClose = false,
  focusCurrentLocation,
  index = 1,
}, ref) => {
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
        enablePanDownToClose={enablePanDownToClose}
        index={index}
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
