
import React, {
  useEffect, useState, useRef, useContext,
} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import Thumbnail from '../../../Components/Thumbnail';
import i18n from '../../../I18n';
import SelectableButton from '../../../Components/SelectableButton';
import { SubmitButtonText } from '../../../Components/SelectableButton/styled';
import BottomSheet from '../../../Components/BottomSheet';
import BottomSheetContextProvider, { BottomSheetContext, SNAP_POINT_STATES } from '../../../context/bottomSheetContext';
import CustomTip from './CustomTip';

const TipSectionContainer = styled.View`
 width: 100%;
 flex:1;
  z-index: 3;
  elevation: 3;
  background: red;

`;


const Container = styled.View`
  flex-direction: column;
  padding: 30px;
  flex: 1;
`;

const Title = styled.Text`
  font-size: 20px;
  color: #333333;
  font-weight: 600;
  margin-bottom: 8px;
`;

const SubTitle = styled.Text`
  font-size: 16px;
  color: #000000;
  opacity: 0.7;
`;

const DetailsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const Column = styled.View`
  flex: 1;
  flex-direction: column;
`;

const ThumbnailContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 55px;
`;

const StyledThumbnail = styled(View)`
  border-color: #24aaf2;
  border-width: 4;
  border-radius: 100;
`;

const NoCustomTipText = styled.Text`
  color: ${({ theme }) => theme.disabledColor};
  padding: 10px;
  font-size: 14px;
`;

const NoCustomTipContainer = styled.View`
  display: flex;
  width: 100%;
  align-items: flex-start;
  margin-top: 5px;
`;

const NoTipTextButton = ({ onPress, children }) => (
  <NoCustomTipContainer>
    <TouchableOpacity onPress={onPress}>
      <NoCustomTipText>{children}</NoCustomTipText>
    </TouchableOpacity>
  </NoCustomTipContainer>
);

const Tips = ({
  driver = { firstName: 'Timmy' }, ridePrice = 33, thumbnailImage,
}) => {
  const [selectedTip, setSelectedTip] = useState(null);
  const [customTip, setCustomTip] = useState(null);

  const settings = {
    percentageThreshold: 30,
    percentage: [10, 15, 20],
    fixedPrice: [1, 2, 5],
  };
  const isPercentage = ridePrice >= settings.percentageThreshold;
  const buttons = isPercentage ? settings.percentage : settings.fixedPrice;
  const tipSuffix = isPercentage ? '%' : '$';

  const bottomSheetRef = useRef(null);
  const {
    snapPoints,
    setSnapPointsState,
    setSnapPointIndex,
  } = useContext(BottomSheetContext);

  useEffect(() => {
    setSnapPointsState(['70%', '100%']);
  }, []);


  const resetTip = () => {
    setSelectedTip(null);
    setCustomTip(null);
  };

  const onTipPressed = (value) => {
    setSelectedTip(value);
    setCustomTip(null);
  };

  const onCustomTipSet = (value) => {
    setCustomTip(value);
    setSelectedTip(null);
  };
  return (
    <>
      <Container>
        <DetailsContainer>
          <Column>
            <Title>
              {`${i18n.t('postRide.tip.title')} ${driver.firstName}`}
            </Title>
            <SubTitle>
              {`${i18n.t('postRide.tip.subTitle')} ${ridePrice}$`}
            </SubTitle>
          </Column>
          <ThumbnailContainer>
            <StyledThumbnail>
              <Thumbnail size={55} />
            </StyledThumbnail>
          </ThumbnailContainer>
        </DetailsContainer>
        <DetailsContainer style={{ marginTop: 30 }}>
          {buttons.map(b => (
            <SelectableButton selected={b === selectedTip} onPress={() => onTipPressed(b)}>
              {`${b}${tipSuffix}`}
            </SelectableButton>
          ))}
        </DetailsContainer>
        <DetailsContainer style={{ marginTop: 5 }}>
          <SelectableButton
            selected={!!customTip}
            onPress={() => bottomSheetRef.current.expand()}
            label={i18n.t('postRide.tip.customTip.title')}
            value={`${customTip}${tipSuffix}`}
          >
            {!customTip ? i18n.t('postRide.tip.setCustomTip') : null}
          </SelectableButton>
        </DetailsContainer>
        <NoTipTextButton onPress={resetTip}>{`${i18n.t('postRide.tip.noTip')}`}</NoTipTextButton>
      </Container>
      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose
        style={{
          zIndex: 3,
          elevation: 5,
        }}
      >
        <CustomTip
          customAmount={customTip}
          onSubmit={value => onCustomTipSet(value)}
          tipSuffix={tipSuffix}
        />
      </BottomSheet>
    </>

  );
};


export default props => (
  <BottomSheetContextProvider {...props}>
    <Tips {...props} />
  </BottomSheetContextProvider>
);
