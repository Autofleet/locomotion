import React, {
  useCallback, useContext, forwardRef, useEffect,
} from 'react';
import BottomSheet, {
  BottomSheetFooter,
  BottomSheetHandle,
} from '@gorhom/bottom-sheet';
import styled from 'styled-components';
import { UserContext } from '../../context/user';
import SafeView from '../SafeView';
import { BottomSheetContext } from '../../context/bottomSheetContext';

const BottomSheetTopInfo = styled.View`
background-color: #989898;
position: absolute;
height: 40px;
top: -40px;
width: 100%;
align-items: center;
border-top-left-radius: 8px;
border-top-right-radius: 8px;
justify-content: center;
`;

const InfoText = styled.Text`
color: #ffffff;
text-align: center;
max-width: 80%;
`;

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
    topBarText,
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

  const getTopBar = () => (
    <BottomSheetHandle indicatorStyle={{ backgroundColor: '#989898', ...(snapPointsAreTheSame() && { display: 'none' }) }} style={{ paddingLeft: 0, paddingRight: 0 }}>
      {!!topBarText && (
      <BottomSheetTopInfo>
        <InfoText>
          {topBarText}
        </InfoText>
      </BottomSheetTopInfo>
      )}
    </BottomSheetHandle>
  );
  return (
    <BottomSheet
      android_keyboardInputMode="adjustResize"
      ref={ref}
      snapPoints={snapPoints}
      onAnimate={onAnimate}
      backgroundStyle={topBarText ? { borderRadius: 0 } : {}}
      footerComponent={renderFooter}
      enablePanDownToClose={enablePanDownToClose}
      index={index}
      handleComponent={getTopBar}
      style={{
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 999,
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
