import React, { useContext, useEffect } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components';
import { RideStateContextContext } from '../../context';
import { RidePageContext } from '../../context/newRideContext';
import i18n from '../../I18n';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';
import Button from '../Button';
import { BottomSheetContext, SNAP_POINT_STATES } from '../../context/bottomSheetContext';

const OtherButton = styled(Button)`
  width: 100%;
  height: 50px;
  border-radius: 8px;
  margin-top: 20px;
`;

const Container = styled(View)`
  width: 100%;
  padding: 10px 20px;
`;

const MainContent = styled(View)`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 60px;
`;

const CardText = styled(View)`
  flex: 3;
  height: 30px;
`;

const CardImage = styled(View)`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

const Title = styled(Text)`
  padding-bottom: 3px;
  ${FONT_SIZES.H2}
  ${FONT_WEIGHTS.MEDIUM}
  color: #333;
`;

const SubTitle = styled(Text)`
  ${FONT_SIZES.LARGE}
  color: ${({ theme }) => theme.disabledColor};
`;

const ButtonTitle = styled(Text)`
  margin: auto;
  ${FONT_SIZES.H2}
  ${({ theme }:{ theme: any }) => `
  color: ${theme.primaryButtonTextColor}
  `};
`;

const AddressInput = styled(Text)`

`;

const BsPage = ({
  onButtonPress,
  image,
  children,
  TitleText,
  SubTitleText,
  ButtonText,
}: {
  onButtonPress: any,
  image: any,
  children?: any,
  TitleText: string,
  SubTitleText: string,
  ButtonText: string,
}) => (
  <Container>
    <MainContent>
      <CardText>
        <Title>{TitleText}</Title>
        <SubTitle>{SubTitleText}</SubTitle>
      </CardText>
      {image ? (
        <CardImage>
          {image}
        </CardImage>
      ) : undefined}
    </MainContent>
    {children}
    <OtherButton onPress={onButtonPress}>
      <ButtonTitle>{ButtonText}</ButtonTitle>
    </OtherButton>
  </Container>
);

BsPage.defaultProps = {
  children: undefined,
};

export default BsPage;

export const NotAvailableHere = (props: any) => (
  <BsPage
    TitleText={i18n.t('bottomSheetContent.notAvailableHere.titleText')}
    ButtonText={i18n.t('bottomSheetContent.notAvailableHere.buttonText')}
    SubTitleText={i18n.t('bottomSheetContent.notAvailableHere.subTitleText')}
    {...props}
  />
);

export const ConfirmPickup = (props: any) => {
  const { setSelectLocationMode } = useContext(RideStateContextContext);
  const { lastSelectedLocation }: { lastSelectedLocation: any } = useContext(RidePageContext);
  const { setSnapPointsState, setSnapPointIndex } = useContext(BottomSheetContext);
  useEffect(() => {
    setSelectLocationMode(true);
    setSnapPointIndex(0);
    setSnapPointsState(SNAP_POINT_STATES.CONFIRM_PICKUP);
  }, []);

  return (
    <BsPage
      TitleText={i18n.t('bottomSheetContent.confirmPickup.titleText')}
      ButtonText={i18n.t('bottomSheetContent.confirmPickup.buttonText')}
      SubTitleText={i18n.t('bottomSheetContent.confirmPickup.subTitleText')}
      {...props}
    >
      <AddressInput>{lastSelectedLocation.description}</AddressInput>
    </BsPage>
  );
};
