import React, { useContext, useEffect, useState } from 'react';
import {
  Linking, Text, View,
} from 'react-native';
import styled from 'styled-components';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import SvgIcon from '../SvgIcon';
import { RidePageContext } from '../../context/newRideContext';
import i18n from '../../I18n';
import { ERROR_COLOR, FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';
import Button from '../Button';
import { BottomSheetContext, SNAP_POINT_STATES } from '../../context/bottomSheetContext';
import { RideStateContextContext } from '../../context/ridePageStateContext';
import { BS_PAGES } from '../../context/ridePageStateContext/utils';
import { MAIN_ROUTES } from '../../pages/routes';
import * as navigationService from '../../services/navigation';
import payments from '../../context/payments';
import errorIcon from '../../assets/error-icon.svg';
import outOfTerritoryIcon from '../../assets/bottomSheet/out_of_territory.svg';
import busyImage from '../../assets/bottomSheet/busy.svg';
import locationIcon from '../../assets/location_pin.svg';
import Loader from '../Loader';
import ActiveRideContent from './ActiveRide';

const OtherButton = styled(Button)`
  background-color: ${({ warning, theme }) => (warning ? ERROR_COLOR : theme.primaryColor)};
  height: 50px;
  border-radius: 8px;
`;


const SecondaryButton = styled(Button).attrs({ noBackground: true })`
  height: 50px;
  border-radius: 8px;
  border: ${({ warning }) => (warning ? `2px solid ${ERROR_COLOR}` : 'none')};
`;

const Container = styled(SafeAreaView)`
  width: 100%;
  padding: 0px 20px;
  height: 100%;
`;

const MainContent = styled(View)`
  flex: 1;
  width: 100%;
  margin-bottom: 5px;
`;

const CardText = styled(View)`
`;

const ImageContainer = styled(View)`
  justify-content: center;
  align-items: center;
`;

const TitleContainer = styled(View)`
display: flex;
flex-direction: row;
margin-bottom: 5px;
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

type SecondaryButtonTitleInterface = {
  warning: boolean | undefined;
}
const SecondaryButtonTitle = styled(Text)<SecondaryButtonTitleInterface>`
  margin: auto;
  ${FONT_SIZES.H2}
  color: ${({ warning, theme }) => (warning ? '#333333' : theme.primaryColor)};
`;

const AddressInput = styled(Text)`
margin-left: 5;
`;

const LoaderContainer = styled(View)`
height: 25px;
width: 100%;
margin: auto 0;
margin-top: 25px;
`;

const Header = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

type FooterInterface = {
  fullWidthButtons: boolean | undefined;
}
const Footer = styled(View)<FooterInterface>`
  width: 100%;
  display: flex;
  flex-direction: ${({ fullWidthButtons }) => (fullWidthButtons ? 'column' : 'row')};
  justify-content: space-between;
  align-items: center;
`;

const AddressContainer = styled(View)`
flex-direction: row;
align-items: center;
`;

const BsPage = ({
  onSecondaryButtonPress,
  onButtonPress,
  Image,
  children,
  titleIcon,
  TitleText,
  SubTitleText,
  ButtonText,
  SecondaryButtonText,
  isLoading,
  buttonDisabled,
  warning,
  fullWidthButtons,
}: {
  onSecondaryButtonPress?: any,
  onButtonPress: any,
  Image: any,
  children?: any,
  titleIcon?: any,
  TitleText: string,
  SubTitleText: string,
  ButtonText: string,
  SecondaryButtonText?: string,
  isLoading?: boolean;
  buttonDisabled?: boolean;
  warning?: boolean
  fullWidthButtons?: boolean;
}) => {
  const buttonWidth = fullWidthButtons ? '100%' : '48%';
  return (
    <Container edges={['bottom']}>
      <MainContent>
        <>
          {TitleText && (
          <Header>
            <CardText style={{ width: Image ? '50%' : '100%' }}>
              <TitleContainer>
                {titleIcon && <SvgIcon Svg={titleIcon} style={{ marginRight: 5 }} />}
                <Title>{TitleText}</Title>
              </TitleContainer>
              <SubTitle numberOfLines={2}>{SubTitleText}</SubTitle>
            </CardText>
            {Image ? (
              <ImageContainer>
                {Image}
              </ImageContainer>
            ) : undefined}
          </Header>
          )}
          {children}
        </>
      </MainContent>
      <Footer fullWidthButtons={fullWidthButtons}>
        {ButtonText && (
        <OtherButton
          testID="confirm"
          style={{ width: buttonWidth }}
          disabled={buttonDisabled}
          onPress={onButtonPress}
          isLoading={isLoading}
          warning={warning}
        >
          <ButtonTitle>{ButtonText}</ButtonTitle>
        </OtherButton>
        )}
        {SecondaryButtonText && (
        <SecondaryButton
          style={{ width: buttonWidth }}
          warning={warning}
          onPress={onSecondaryButtonPress}
        >
          <SecondaryButtonTitle warning={warning}>{SecondaryButtonText}</SecondaryButtonTitle>
        </SecondaryButton>
        )}
      </Footer>
    </Container>
  );
};

BsPage.defaultProps = {
  children: undefined,
  titleIcon: undefined,
  onSecondaryButtonPress: () => undefined,
  SecondaryButtonText: undefined,
  isLoading: false,
  buttonDisabled: false,
  warning: false,
  fullWidthButtons: false,
};

export default BsPage;

export const LocationRequest = (props: any) => {
  const [operation, setOperation] = useState();

  const getOperationName = async () => {
    // get operation name
  };
  useEffect(() => {
    getOperationName();
  }, []);
  return (
    <BsPage
      TitleText={i18n.t('bottomSheetContent.locationRequest.titleText')}
      ButtonText={i18n.t('bottomSheetContent.locationRequest.buttonText')}
      SecondaryButtonText={i18n.t('bottomSheetContent.locationRequest.secondaryButtonText')}
      SubTitleText={i18n.t('bottomSheetContent.locationRequest.subTitleText', { operation })}
      onButtonPress={Linking.openSettings}
      fullWidthButtons
      {...props}
    />
  );
};

export const CancelRide = (props: any) => {
  const { cancelRide } = useContext(RidePageContext);
  const { changeBsPage } = useContext(RideStateContextContext);

  return (
    <BsPage
      TitleText={i18n.t('bottomSheetContent.cancelRide.titleText')}
      ButtonText={i18n.t('bottomSheetContent.cancelRide.buttonText')}
      SubTitleText={i18n.t('bottomSheetContent.cancelRide.subTitleText')}
      SecondaryButtonText={i18n.t('bottomSheetContent.cancelRide.secondaryButtonText')}
      onButtonPress={cancelRide}
      onSecondaryButtonPress={() => changeBsPage(BS_PAGES.ACTIVE_RIDE)}
      warning
      {...props}
    />
  );
};

export const NotAvailableHere = (props: any) => {
  const { setSnapPointsState } = useContext(BottomSheetContext);

  useEffect(() => {
    setSnapPointsState(SNAP_POINT_STATES.NOT_IN_TERRITORY);
  }, []);


  return (
    <BsPage
      TitleText={i18n.t('bottomSheetContent.notAvailableHere.titleText')}
      ButtonText={i18n.t('bottomSheetContent.notAvailableHere.buttonText')}
      SubTitleText={i18n.t('bottomSheetContent.notAvailableHere.subTitleText')}
      Image={<SvgIcon Svg={outOfTerritoryIcon} height={85} width={140} />}
      {...props}
    />
  );
};

export const ConfirmPickup = (props: any) => {
  const {
    lastSelectedLocation,
    getCurrentLocationAddress,
    saveSelectedLocation,
    setSelectedInputIndex,
    rideRequestLoading,
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

  const titleText = props.isConfirmPickup ? 'confirmPickupTitle' : 'confirmLocationTitle';

  return (
    <BsPage
      TitleText={i18n.t(`bottomSheetContent.confirmPickup.${titleText}`)}
      ButtonText={i18n.t(`bottomSheetContent.confirmPickup.${props.isConfirmPickup ? 'buttonTextWithRequest' : 'buttonText'}`)}
      SubTitleText={i18n.t('bottomSheetContent.confirmPickup.subTitleText')}
      isLoading={rideRequestLoading}
      fullWidthButtons
      {...props}
      onButtonPress={() => {
        if (props.onButtonPress) {
          props.onButtonPress(lastSelectedLocation);
        }
      }}
      buttonDisabled={!lastSelectedLocation?.streetAddress}
    >
      <AddressContainer>
        <SvgIcon Svg={locationIcon} height={20} width={10} fill="#333" />
        <AddressInput>{lastSelectedLocation?.streetAddress || i18n.t('bottomSheetContent.confirmPickup.noAddress')}</AddressInput>
      </AddressContainer>
    </BsPage>
  );
};

export const NoPayment = (props: any) => {
  const { setSnapPointsState } = useContext(BottomSheetContext);
  const { changeBsPage } = useContext(RideStateContextContext);
  const { requestRide, ride } = useContext(RidePageContext);

  const {
    paymentMethods,
    clientHasValidPaymentMethods,
  } = payments.useContainer();

  const proceedIfPaymentMethodsAreValid = () => {
    if (clientHasValidPaymentMethods() || ride.paymentMethodId === 'cash') {
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
      fullWidthButtons
      Image={<SvgIcon Svg={busyImage} height={85} width={140} />}
      {...props}
    />
  );
};

export const ActiveRide = (props: any) => (
  <BsPage
    {...props}
  >
    <ActiveRideContent />
  </BsPage>
);
