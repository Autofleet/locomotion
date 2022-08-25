import React, { useContext, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import styled from 'styled-components';
import TextInput from '../../Components/TextInput';
import {
  ErrorText, InputContainer,
} from '../Profile/styles';
import i18n from '../../I18n';
import { MAIN_ROUTES } from '../routes';
import { PageContainer, ContentContainer } from '../styles';
import * as navigationService from '../../services/navigation';
import RoundedButton from '../../Components/RoundedButton';
import PageHeader from '../../Components/PageHeader';
import ScreenText from '../Profile/ScreenText';
import { UserContext } from '../../context/user';

const StyledButton = styled(RoundedButton)`
margin: 5px;
`;

const PromoCode = () => {
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const { createCoupon } = useContext(UserContext);
  const route: any = useRoute();

  const onAddPromoCode = async () => {
    try {
      const coupon = await createCoupon(code);
      console.log(coupon);
      if (route.params && route.params.rideFlow) {
        navigationService.navigate(MAIN_ROUTES.HOME);
      }
    } catch (e) {
      console.log(e);
      setError(true);
    }
  };
  return (
    <PageContainer>
      <PageHeader title={i18n.t('home.promoCode.pageHeader')} />
      <ContentContainer>
        <ScreenText
          text={i18n.t('home.promoCode.title')}
        />
        <InputContainer>
          <TextInput
            testID="promoCode"
            autoFocus
            placeholder={i18n.t('home.promoCode.placeholder')}
            onChangeText={(c: string) => {
              setError(false);
              setCode(c);
            }}
            value={code}
            autoCapitalize="none"
            autoCorrect={false}
            fullBorder
          />
        </InputContainer>
        {error && <ErrorText>{i18n.t('home.promoCode.errorText')}</ErrorText>}
        <StyledButton
          testID="addPromoCode"
          disabled={!code || error}
          onPress={onAddPromoCode}
        >
          {i18n.t('home.promoCode.buttonText')}
        </StyledButton>
      </ContentContainer>
    </PageContainer>
  );
};

export default PromoCode;
