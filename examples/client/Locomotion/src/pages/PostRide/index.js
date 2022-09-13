import React, {
  useEffect, useState, useRef, useContext,
} from 'react';
import { isCardPaymentMethod } from '../../lib/ride/utils';
import { PAYMENT_METHODS } from '../../pages/Payments/consts';
import { formatRides, rideHistoryContext } from '../../context/rideHistory';
import FullPageLoader from '../../Components/FullPageLoader';
import { getPriceCalculation } from '../../context/futureRides/api';
import { APP_ROUTES, MAIN_ROUTES } from '../routes';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import {
  PageContent,
  SummaryStarsTitle,
  RatingContainer,
  TipsContainer,
  SubmitContainer,
} from './styled';
import { PageContainer } from '../styles';
import StarRating from './StarRating';
import Tips from './Tips';
import Button from '../../Components/RoundedButton';
import settings from '../../context/settings';
import SETTINGS_KEYS from '../../context/settings/keys';
import NewRidePageContextProvider, { RidePageContext } from '../../context/newRideContext';
import closeIcon from '../../assets/x.png';
import BottomSheetContextProvider, { BottomSheetContext } from '../../context/bottomSheetContext';
import { RideStateContextContext } from '../..';
import { BS_PAGES } from '../../context/ridePageStateContext/utils';
import * as navigationService from '../../services/navigation';

const PostRidePage = ({ menuSide, route }) => {
  const { rideId, priceCalculationId } = route?.params;
  const [rating, setRating] = useState(null);
  const [ride, setRide] = useState(null);
  const [tipFromDb, setTipFromDb] = useState();
  const [rideTip, setRideTip] = useState(null);
  const [tipSettings, setTipSettings] = useState({
    percentageThreshold: 30,
    percentage: [10, 15, 20],
    fixedPrice: [1, 2, 5],
  });
  const {
    postRideSubmit,
    getRideFromApi,
    cleanRideState,
  } = useContext(RidePageContext);
  const { changeBsPage } = useContext(RideStateContextContext);
  const {
    rides: pastRides, setRides: setPastRides,
  } = useContext(rideHistoryContext);
  const { getSettingByKey } = settings.useContainer();

  const onRatingUpdate = (selectedRating) => {
    setRating(selectedRating);
  };

  const onSelectTip = (tipAmount) => {
    setRideTip(tipAmount);
  };

  const initSettings = async () => {
    const setting = await getSettingByKey(
      SETTINGS_KEYS.POST_RIDE_TIP_SETTINGS,
    );
    setTipSettings(setting);
  };

  const loadRide = async () => {
    const [rideData, priceCalculation] = await Promise.all(
      [
        getRideFromApi(rideId),
        ...[(priceCalculationId && getPriceCalculation(priceCalculationId))],
      ],
    );
    if (priceCalculation) {
      const tipObj = priceCalculation.additionalCharges.find(charge => charge.chargeFor === 'tip');
      setTipFromDb((tipObj || {}).amount);
    }
    setRide(rideData);
  };

  useEffect(() => {
    initSettings();
    loadRide();
  }, []);

  const nextPage = () => {
    if (priceCalculationId) {
      const [formattedRide] = formatRides([ride]);
      const newRidesHistory = pastRides.map(pr => (pr.id === ride.id ? formattedRide : pr));
      setPastRides(newRidesHistory);
      return navigationService.goBack();
    }
    cleanRideState();
    navigationService.navigate(MAIN_ROUTES.HOME, {}, APP_ROUTES.MAIN_APP);
    changeBsPage(BS_PAGES.ADDRESS_SELECTOR);
  };
  const onSubmit = async () => {
    try {
      await postRideSubmit(ride.id, {
        rating,
        tip: rideTip,
        priceCalculationId: ride.priceCalculationId,
      });
      nextPage();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const {
    isExpanded,
  } = useContext(BottomSheetContext);

  const getButtonText = () => {
    if (priceCalculationId) {
      return i18n.t('postRide.submitForPast');
    }
    return i18n.t('postRide.submit');
  };

  return (
    <>
      {ride ? (
        <PageContainer>
          <PageHeader
            title={i18n.t('postRide.pageTitle')}
            onIconPress={nextPage}
            iconSide={menuSide}
            icon={closeIcon}
          />
          <PageContent>
            {!ride.rating && (
            <RatingContainer>
              <SummaryStarsTitle>{i18n.t('postRide.ratingHeadline')}</SummaryStarsTitle>
              <StarRating onUpdate={onRatingUpdate} />
            </RatingContainer>
            )}

            {isCardPaymentMethod(ride?.payment?.paymentMethod) && !(priceCalculationId && tipFromDb) && (
            <TipsContainer>
              {ride?.priceCurrency && (ride?.priceAmount || ride?.priceAmount === 0)
                ? (
                  <Tips
                    tipSettings={tipSettings}
                    onSelectTip={onSelectTip}
                    driver={{ firstName: ride?.driver?.firstName, avatar: ride?.driver?.avatar }}
                    ridePrice={ride?.priceAmount}
                    priceCurrency={ride?.priceCurrency}
                  />
                ) : null}
            </TipsContainer>
            )}
            <SubmitContainer>
              <Button onPress={onSubmit} disabled={isExpanded}>{getButtonText()}</Button>
            </SubmitContainer>
          </PageContent>
        </PageContainer>
      ) : <FullPageLoader />}
    </>
  );
};


export default props => (
  <BottomSheetContextProvider {...props}>
    <PostRidePage {...props} />
  </BottomSheetContextProvider>
);
