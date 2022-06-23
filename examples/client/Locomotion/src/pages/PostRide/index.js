import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MAIN_ROUTES } from '../routes';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import {
  PageContent,
  SummaryTitle,
  SummarySubTitle,
  SummaryItems,
  SummaryItem,
  SummaryItemIcon,
  SummaryItemTitle,
  SummaryItemText,
  SummaryStarsSubTitle,
  SummaryStarsTitle,
  RatingContainer,


} from './styled';
import Mixpanel from '../../services/Mixpanel';
import { PageContainer } from '../styles';
import StarRating from './StarRating';

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
          {/*  <RoundedButton
            data-test-id="SubmitRideSummaryPopupButton"
            onPress={() => onSubmit()}
          >
            {i18n.t('popups.rideSummary.submit')}
          </RoundedButton>
          { ratingSent ? <SummaryStarsSubTitle>{i18n.t('popups.rideSummary.ratingPost')}</SummaryStarsSubTitle> : null}
 */}
        </RatingContainer>
      </PageContent>
    </PageContainer>
  );
};
