import React, {
  useEffect, useState, useRef, useContext,
} from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MAIN_ROUTES } from '../routes';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import {
  PageContent,
  SummaryStarsTitle,
  RatingContainer,
  TipsContainer,
  SubmitContainer,
} from './styled';
import Mixpanel from '../../services/Mixpanel';
import { PageContainer } from '../styles';
import StarRating from './StarRating';
import Tips from './Tips';
import Button from '../../Components/RoundedButton';
import settings from '../../context/settings';
import SETTINGS_KEYS from '../../context/settings/keys';
import NewRidePageContextProvider, { RidePageContext } from '../../context/newRideContext';
import closeIcon from '../../assets/x.png';
import BottomSheetContextProvider, { BottomSheetContext } from '../../context/bottomSheetContext';
import { isCashPaymentMethod } from '../../lib/ride/utils';

const PostRidePage = ({ menuSide, route }) => {
  const navigation = useNavigation();
  const router = useRoute();
  const [rating, setRating] = useState(null);
  const [ride, setRide] = useState({});
  const [rideTip, setRideTip] = useState(null);
  const [tipSettings, setTipSettings] = useState({
    percentageThreshold: 30,
    percentage: [10, 15, 20],
    fixedPrice: [1, 2, 5],
  });
  const {
    postRideSubmit,
    getRideFromApi,
  } = useContext(RidePageContext);

  const { getSettingByKey } = settings.useContainer();

  useEffect(() => {
    Mixpanel.pageView(router.name);
  }, []);

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
    const rideData = await getRideFromApi(route.params.rideId);
    setRide(rideData);
  };

  useEffect(() => {
    initSettings();
    loadRide();
  }, []);

  const onSubmit = async () => {
    try {
      await postRideSubmit(ride.id, rating, rideTip);
      navigation.navigate(MAIN_ROUTES.HOME);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const {
    isExpanded,
  } = useContext(BottomSheetContext);

  return (
    <PageContainer>
      <PageHeader
        title={i18n.t('postRide.pageTitle')}
        onIconPress={() => navigation.navigate(MAIN_ROUTES.HOME)}
        iconSide={menuSide}
        icon={closeIcon}
      />
      <PageContent>
        <RatingContainer>
          <SummaryStarsTitle>{i18n.t('postRide.ratingHeadline')}</SummaryStarsTitle>
          <StarRating onUpdate={onRatingUpdate} />
        </RatingContainer>

        <TipsContainer>
          <Tips
            tipSettings={tipSettings}
            onSelectTip={onSelectTip}
            driver={{ firstName: ride?.driver?.firstName, avatar: ride?.driver?.avatar }}
            ridePrice={ride?.priceAmount}
            priceCurrency={ride?.priceCurrency}
          />
        </TipsContainer>
        <SubmitContainer>
          <Button onPress={onSubmit} disabled={isExpanded}>{i18n.t('postRide.submit')}</Button>
        </SubmitContainer>
      </PageContent>
    </PageContainer>
  );
};


export default props => (
  <BottomSheetContextProvider {...props}>
    <PostRidePage {...props} />
  </BottomSheetContextProvider>
);
