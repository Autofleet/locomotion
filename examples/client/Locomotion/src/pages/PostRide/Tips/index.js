
import React, {
  useEffect, useState, useRef, useContext,
} from 'react';
import {
  View, Text, TouchableOpacity, Image,
} from 'react-native';
import styled from 'styled-components';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import Button from '../../../Components/Button';
import Thumbnail from '../../../Components/Thumbnail';
import i18n from '../../../I18n';
import SelectableButton from '../../../Components/SelectableButton';
import { SubmitButtonText } from '../../../Components/SelectableButton/styled';
import BottomSheet from '../../../Components/BottomSheet';
import BottomSheetContextProvider, { BottomSheetContext, SNAP_POINT_STATES } from '../../../context/bottomSheetContext';
import CustomTip from './CustomTip';
import { getFormattedPrice, getCurrencySymbol } from '../../../context/newRideContext/utils';
import PaymentContext from '../../../context/payments';

const TipSectionContainer = styled.View`
 width: 100%;
 flex:1;
  z-index: 3;
  elevation: 3;
  background: red;

`;


const Container = styled.View`
  flex-direction: column;
  padding: 10px 0px 0px 10px;
  flex: 1;
`;

const Title = styled.Text`
  font-size: 18px;
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


export const DriverAvatar = styled(Image)`
  width: 60px;
  height: 60px;
  border-radius: 100px;
  border-color: ${({ theme }) => theme.primaryColor};
  border-width: 4;
 `;

const NoTipTextButton = ({ onPress, children }) => (
  <NoCustomTipContainer>
    <Button testID="resetTip" noBackground onPress={onPress}>
      <NoCustomTipText>{children}</NoCustomTipText>
    </Button>
  </NoCustomTipContainer>
);
const Tips = ({
  driver,
  ridePrice,
  tipSettings,
  onSelectTip,
  priceCurrency = null,
}) => {
  const [selectedTip, setSelectedTip] = useState(null);
  const [customTip, setCustomTip] = useState(null);
  const { showPrice, loadShowPrice } = PaymentContext.useContainer();

  const isPercentage = ridePrice >= tipSettings.percentageThreshold;
  const buttons = isPercentage ? tipSettings.percentage : tipSettings.fixedPrice;
  const serviceDisplayPrice = getFormattedPrice(priceCurrency, ridePrice);

  const tipSuffix = isPercentage ? '%' : getCurrencySymbol(priceCurrency);

  const bottomSheetRef = useRef(null);
  const {
    setSnapPointsState,
    isExpanded,
  } = useContext(BottomSheetContext);

  useEffect(() => {
    setSnapPointsState(SNAP_POINT_STATES.CUSTOM_TIP);
    loadShowPrice();
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

  const calculateTipAmount = () => {
    let calculatedTip = 0;
    if (!customTip && !selectedTip) {
      return calculatedTip;
    }

    calculatedTip = customTip || selectedTip;

    if (isPercentage) {
      calculatedTip = ridePrice * (calculatedTip) / 100;
    }

    return calculatedTip.toFixed(2);
  };

  useEffect(() => {
    onSelectTip(calculateTipAmount());
  }, [selectedTip, customTip]);

  const formatCurrency = (value) => {
    if (isPercentage) {
      return `${value}${tipSuffix}`;
    }

    return getFormattedPrice(priceCurrency, value);
  };
  return (
    <>
      <Container>
        <DetailsContainer>
          <Column>
            <Title testID="tipPageTitle">
              {`${i18n.t('postRide.tip.title')} ${driver.firstName}`}
            </Title>
            {showPrice && (
            <SubTitle testID="postRideTip">
              {`${i18n.t('postRide.tip.subTitle')} ${serviceDisplayPrice}`}
            </SubTitle>
            )}
          </Column>
          <ThumbnailContainer>
            <StyledThumbnail>
              <DriverAvatar size={60} source={{ uri: driver.avatar }} />
            </StyledThumbnail>
          </ThumbnailContainer>
        </DetailsContainer>
        <DetailsContainer style={{ marginTop: 30 }}>
          {buttons.map((b, i) => (
            <SelectableButton testID={`tipButton${i}`} selected={b === selectedTip} onPress={() => onTipPressed(b)}>
              {formatCurrency(b)}
            </SelectableButton>
          ))}
        </DetailsContainer>
        <DetailsContainer style={{ marginTop: 5 }}>
          <SelectableButton
            testID="customTipButton"
            selected={!!customTip}
            onPress={() => bottomSheetRef.current.snapToIndex(0)}
            label={i18n.t('postRide.tip.customTip.title')}
            value={customTip ? formatCurrency(customTip) : null}
          >
            {!customTip ? i18n.t('postRide.tip.setCustomTip') : null}
          </SelectableButton>
        </DetailsContainer>
        <NoTipTextButton onPress={resetTip}>{`${i18n.t('postRide.tip.noTip')}`}</NoTipTextButton>
      </Container>
      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose
        index={-1}
        closeable
        style={{
          zIndex: 3,
          elevation: 5,
        }}
      >
        <CustomTip
          customAmount={customTip}
          onSubmit={value => onCustomTipSet(value)}
          tipSuffix={tipSuffix}
          isExpanded={isExpanded}
        />
      </BottomSheet>
    </>

  );
};


export default props => (

  <Tips {...props} />

);
