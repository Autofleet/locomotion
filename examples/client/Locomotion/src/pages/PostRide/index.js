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
import BottomSheet from '../../Components/BottomSheet';
import BottomSheetContextProvider, { BottomSheetContext, SNAP_POINT_STATES } from '../../context/bottomSheetContext';
import CustomTip from './Tips/CustomTip';

const PostRidePage = ({ menuSide }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [rating, setRating] = useState(null);
  const [customTip, setCustomTip] = useState(null);
  const [rideTip, setRideTip] = useState(null);

  useEffect(() => {
    Mixpanel.pageView(route.name);
  }, []);


  const onRatingUpdate = (selectedRating) => {
    setRating(selectedRating);
  };

  const onSelectTip = () => {
    // setRideTip()
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

        <TipsContainer style={{
          zIndex: 5,
          elevation: 5,
          flex: 2,
        }}
        >
          <Tips />
        </TipsContainer>
        <SubmitContainer>
          <Button>{i18n.t('postRide.submit')}</Button>
        </SubmitContainer>
      </PageContent>
    </PageContainer>
  );
};


export default props => (

  <PostRidePage {...props} />
);
