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

const PostRidePage = ({ menuSide }: { menuSide: string }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [rating, setRating] = useState<number|null>(null);
  const [rideTip, setRideTip] = useState<number|null>(null);
  const [tipSettings, setTipSettings] = useState({
    percentageThreshold: 30,
    percentage: [10, 15, 20],
    fixedPrice: [1, 2, 5],
  });
  const {
    postRideSubmit,
    ride,
  } = useContext(RidePageContext);

  const { getSettingByKey } = settings.useContainer();

  useEffect(() => {
    Mixpanel.pageView(route.name);
  }, []);


  const onRatingUpdate = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const onSelectTip = (tipAmount: number|null) => {
    console.log('tipAmount', tipAmount);
    setRideTip(tipAmount);
  };

  const initSettings = async () => {
    const setting = await getSettingByKey(
      SETTINGS_KEYS.POST_RIDE_TIP_SETTINGS,
    );
    setTipSettings(setting);
  };

  useEffect(() => {
    initSettings();
  }, []);

  const onSubmit = async () => {
    if (rating) {
      try {
        postRideSubmit(ride.id, rating, rideTip);
      } catch (e) {
        console.log(e);
      }
    }
  };
  console.log(ride);
  return (
    <PageContainer>
      <PageHeader
        title={i18n.t('postRide.pageTitle')}
        onIconPress={() => navigation.navigate(MAIN_ROUTES.HOME)}
        iconSide={menuSide}
      />
      <PageContent>
        <RatingContainer>
          <SummaryStarsTitle>{i18n.t('postRide.ratingHeadline')}</SummaryStarsTitle>
          <StarRating onUpdate={onRatingUpdate} />
        </RatingContainer>

        <TipsContainer style={{
          zIndex: 5,
          elevation: 5,
          flex: 2,
        }}
        >
          <Tips
            tipSettings={tipSettings}
            onSelectTip={onSelectTip}
            driver={{ firstName: ride?.driver?.firstName, avatar: ride?.driver?.avatar }}
            ridePrice={ride?.priceAmount}
            priceCurrency={ride?.priceCurrency}
          />
        </TipsContainer>
        <SubmitContainer>
          <Button onPress={onSubmit}>{i18n.t('postRide.submit')}</Button>
        </SubmitContainer>
      </PageContent>
    </PageContainer>
  );
};


export default props => (
  <NewRidePageContextProvider {...props}>

    <PostRidePage {...props} />
  </NewRidePageContextProvider>
);