import React, { useContext, useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import styled from 'styled-components';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import SvgIcon from '../SvgIcon';
import { RidePageContext } from '../../context/newRideContext';
import i18n from '../../I18n';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';
import Button from '../Button';
import { BottomSheetContext, SNAP_POINT_STATES } from '../../context/bottomSheetContext';
import { RideStateContextContext } from '../../context/ridePageStateContext';
import { BS_PAGES } from '../../context/ridePageStateContext/utils';
import { MAIN_ROUTES } from '../../pages/routes';
import * as navigationService from '../../services/navigation';
import payments from '../../context/payments';
import errorIcon from '../../assets/error-icon.svg';
import Loader from '../Loader';
import DriverCard from '../DriverCard';

const OtherButton = styled(Button)`
  width: 100%;
  height: 50px;
  border-radius: 8px;
  margin-top: 20px;
`;


const SecondaryButton = styled(Button).attrs({ noBackground: true })`
  width: 100%;
  height: 50px;
  border-radius: 8px;
  margin-top: 10px;
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

const TitleContainer = styled(View)`
display: flex;
flex-direction: row;
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
  height: 35px;
`;

const ButtonTitle = styled(Text)`
  margin: auto;
  ${FONT_SIZES.H2}
  ${({ theme }:{ theme: any }) => `
    color: ${theme.primaryButtonTextColor}
  `};
`;

const SecondaryButtonTitle = styled(Text)`
  margin: auto;
  ${FONT_SIZES.H2}
  ${({ theme }:{ theme: any }) => `
    color: ${theme.primaryColor}
  `};
`;

const AddressInput = styled(Text)``;

const LoaderContainer = styled(View)`
height: 25px;
width: 100%;
margin: auto 0;
margin-top: 25px;
`;

const BsPage = ({
  onSecondaryButtonPress,
  onButtonPress,
  image,
  children,
  titleIcon,
  TitleText,
  SubTitleText,
  ButtonText,
  SecondaryButtonText,
  isLoading,
}: {
  onSecondaryButtonPress: any,
  onButtonPress: any,
  image: any,
  children?: any,
  titleIcon?: any,
  TitleText: string,
  SubTitleText: string,
  ButtonText: string,
  SecondaryButtonText: string,
  isLoading: boolean;
}) => (
  <Container>
    <MainContent>
      <CardText>
        <TitleContainer>
          {titleIcon && <SvgIcon Svg={titleIcon} style={{ marginRight: 5 }} />}
          <Title>{TitleText}</Title>
        </TitleContainer>
        <SubTitle numberOfLines={2}>{SubTitleText}</SubTitle>
      </CardText>
      {image ? (
        <CardImage>
          {image}
        </CardImage>
      ) : undefined}
    </MainContent>
    {children}
    {ButtonText && (
    <OtherButton onPress={onButtonPress} isLoading={isLoading}>
      <ButtonTitle>{ButtonText}</ButtonTitle>
    </OtherButton>
    )}
    {SecondaryButtonText && (
    <SecondaryButton onPress={onSecondaryButtonPress}>
      <SecondaryButtonTitle>{SecondaryButtonText}</SecondaryButtonTitle>
    </SecondaryButton>
    )}
  </Container>
);

BsPage.defaultProps = {
  children: undefined,
  titleIcon: undefined,
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
  const {
    lastSelectedLocation,
    getCurrentLocationAddress,
    saveSelectedLocation,
    updateRequestSp,
    setSelectedInputIndex,
    rideRequestLoading,
  }: {
    lastSelectedLocation: any,
    getCurrentLocationAddress: any,
    saveSelectedLocation: any,
    updateRequestSp: any,
    setSelectedInputIndex: any,
    rideRequestLoading: boolean,
  } = useContext(RidePageContext);

  const { setSnapPointsState } = useContext(BottomSheetContext);
  const { collapse } = useBottomSheet();

  const setInitialLocation = async () => {
    if (props.initialLocation) {
      saveSelectedLocation(props.initialLocation);
      setSelectedInputIndex(0);
    } else {
      const sp = await getCurrentLocationAddress();
      saveSelectedLocation(sp);
    }
  };

  useEffect(() => {
    collapse();
    setSnapPointsState(SNAP_POINT_STATES.CONFIRM_PICKUP);
    setInitialLocation();
  }, []);

  return (
    <BsPage
      TitleText={i18n.t('bottomSheetContent.confirmPickup.titleText')}
      ButtonText={i18n.t('bottomSheetContent.confirmPickup.buttonText')}
      SubTitleText={i18n.t('bottomSheetContent.confirmPickup.subTitleText')}
      isLoading={rideRequestLoading}
      {...props}
      onButtonPress={() => {
        updateRequestSp(lastSelectedLocation);
        if (props.onButtonPress) {
          props.onButtonPress();
        }
      }}
    >
      <AddressInput>{lastSelectedLocation?.streetAddress}</AddressInput>
    </BsPage>
  );
};

export const NoPayment = (props: any) => {
  const { setSnapPointsState } = useContext(BottomSheetContext);
  const { changeBsPage } = useContext(RideStateContextContext);
  const { requestRide } = useContext(RidePageContext);

  const {
    paymentMethods,
    clientHasValidPaymentMethods,
  } = payments.useContainer();

  const proceedIfPaymentMethodsAreValid = () => {
    if (clientHasValidPaymentMethods()) {
      requestRide();
    }
  };

  useEffect(() => {
    setSnapPointsState(SNAP_POINT_STATES.NO_PAYMENT);
  }, []);

  useEffect(() => {
    proceedIfPaymentMethodsAreValid();
  }, [paymentMethods]);

  return (
    <BsPage
      titleIcon={errorIcon}
      TitleText={i18n.t('bottomSheetContent.noPayment.titleText')}
      ButtonText={i18n.t('bottomSheetContent.noPayment.buttonText')}
      SubTitleText={i18n.t('bottomSheetContent.noPayment.subTitleText')}
      SecondaryButtonText={i18n.t('bottomSheetContent.noPayment.secondaryButtonText')}
      onSecondaryButtonPress={() => {
        changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
      }}
      onButtonPress={() => {
        navigationService.navigate(MAIN_ROUTES.PAYMENT, { rideFlow: true });
      }}
      {...props}
    />
  );
};

export const ConfirmingRide = (props: any) => {
  const { setSnapPointsState } = useContext(BottomSheetContext);

  useEffect(() => {
    setSnapPointsState(SNAP_POINT_STATES.CONFIRMING_RIDE);
  }, []);

  return (
    <BsPage
      TitleText={i18n.t('bottomSheetContent.confirmingRide.titleText')}
      {...props}
    >
      <LoaderContainer>
        <Loader
          dark
          lottieViewStyle={{
            height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center',
          }}
          sourceProp={null}
        />
      </LoaderContainer>
    </BsPage>
  );
};

export const NoAvailableVehicles = (props: any) => {
  const { setSnapPointsState } = useContext(BottomSheetContext);

  useEffect(() => {
    setSnapPointsState(SNAP_POINT_STATES.NO_AVAILABLE_VEHICLES);
  }, []);

  return (
    <BsPage
      TitleText={i18n.t('bottomSheetContent.noAvailableVehicles.titleText')}
      ButtonText={i18n.t('bottomSheetContent.noAvailableVehicles.buttonText')}
      SubTitleText={i18n.t('bottomSheetContent.noAvailableVehicles.subTitleText')}
      {...props}
    />
  );
};

export const ActiveRide = (props: any) => {
  const { setSnapPointsState } = useContext(BottomSheetContext);
  const { ride } = useContext(RidePageContext);

  useEffect(() => {
    setSnapPointsState(SNAP_POINT_STATES.ACTIVE_RIDE);
  }, []);

  return (
    <BsPage
      TitleText={i18n.t('bottomSheetContent.confirmingRide.titleText')}
      {...props}
    >
      <>
        <DriverCard 
          showRating={false} 
          ride={ride}
        />
      </>
    </BsPage>
  );
};
