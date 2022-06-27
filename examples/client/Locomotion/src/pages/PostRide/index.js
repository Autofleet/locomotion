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

  const bottomSheetRef = useRef(null);
  const {
    snapPoints,
    setSnapPointsState,
    setSnapPointIndex,
  } = useContext(BottomSheetContext);

  useEffect(() => {
    setSnapPointsState(['40%']);
    // setSnapPointIndex(-1);
    Mixpanel.pageView(route.name);
  }, []);

  /*   useEffect(() => {
    const unsubscribe = navigation.addListener('willFocus', () => {

    });

    return unsubscribe;
  }, [navigation]); */

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
          <Tips onCustom={() => setSnapPointIndex(0)} />
        </TipsContainer>
        <SubmitContainer>
          <Button>Continue</Button>
        </SubmitContainer>
      </PageContent>
      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose

      >
        <CustomTip />
      </BottomSheet>
    </PageContainer>
  );
};


export default props => (
  <BottomSheetContextProvider {...props}>
    <PostRidePage {...props} />
  </BottomSheetContextProvider>
);
