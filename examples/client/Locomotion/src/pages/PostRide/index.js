import React, { useEffect, useState } from 'react';
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
} from './styled';
import Mixpanel from '../../services/Mixpanel';
import { PageContainer } from '../styles';
import StarRating from './StarRating';
import Tips from './Tips';


export default ({ menuSide }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [rating, setRating] = useState(null);

  useEffect(() => {
    Mixpanel.pageView(route.name);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('willFocus', () => {

    });

    return unsubscribe;
  }, [navigation]);

  const onRatingUpdate = (selectedRating) => {
    setRating(selectedRating);
  };

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
        <TipsContainer>
          <Tips />
        </TipsContainer>
      </PageContent>
    </PageContainer>
  );
};
