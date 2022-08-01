import React, { useEffect, useContext, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PaymentIcon } from 'react-native-payment-icons';
import { Platform } from 'react-native';
import ConfirmationPopup from '../../popups/ConfirmationPopup';
import cashPaymentMethod from '../../pages/Payments/cashPaymentMethod';
import Card from '../../Components/InformationCard';
import PaymentsContext from '../../context/payments';
import { MAIN_ROUTES } from '../routes';

import ThumbnailPicker from '../../Components/ThumbnailPicker';
import {
  AccountHeaderContainer,
  AccountHeaderIndicatorContainer,
  AccountHeaderMainContainer,
  AccountHeaderMainText,
  AccountHeaderSubText,
  CardsContainer,
  Container,
  FlexCenterContainer,
  LogoutContainer,
  LogoutText,
  Type,
  PaymentMethodContent,
  DeleteText,
} from './styled';
import i18n from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import CardsTitle from '../../Components/CardsTitle';
import Mixpanel from '../../services/Mixpanel';
import { PageContainer } from '../styles';
import { UserContext } from '../../context/user';
import GenericErrorPopup from '../../popups/GenericError';

const AccountHeader = () => {
  const { updateUserInfo, user } = useContext(UserContext);

  const onImageChoose = (image) => {
    updateUserInfo({ avatar: image });
  };

  return (
    <AccountHeaderContainer>
      <FlexCenterContainer>
        <ThumbnailPicker
          onImageChoose={onImageChoose}
          size={125}
          avatarSource={user.avatar}
        />
      </FlexCenterContainer>
      <AccountHeaderMainContainer>
        <AccountHeaderMainText>
          {user ? `${user.firstName} ${user.lastName}` : ''}
        </AccountHeaderMainText>
        <AccountHeaderIndicatorContainer>
          <AccountHeaderMainContainer>
            <AccountHeaderSubText>{/* todo 12 Trips */}</AccountHeaderSubText>
          </AccountHeaderMainContainer>
          <AccountHeaderMainContainer>
            <AccountHeaderSubText>{/* todo 200 Miles */}</AccountHeaderSubText>
          </AccountHeaderMainContainer>
        </AccountHeaderIndicatorContainer>
      </AccountHeaderMainContainer>
    </AccountHeaderContainer>
  );
};

const AccountContent = ({ navigation }) => {
  const [showError, setShowError] = useState(false);
  const [isDeleteUserVisible, setIsDeleteUserVisible] = useState(false);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(null);

  const { user, deleteUser } = useContext(UserContext);
  const usePayments = PaymentsContext.useContainer();


  const updateDefault = async () => {
    const { paymentMethods } = await usePayments.getOrFetchCustomer();
    const defaultMethod = paymentMethods.find(x => x.isDefault);
    if (defaultMethod) {
      setDefaultPaymentMethod({ ...defaultMethod, mark: true });
    }
  };
  useEffect(() => {
    updateDefault();
  }, [usePayments.paymentMethods]);

  const emailIsVerified = user?.isEmailVerified;
  const onEmailPress = () => (emailIsVerified
    ? navigation.navigate(MAIN_ROUTES.EMAIL, {
      editAccount: true,
    })
    : navigation.navigate(MAIN_ROUTES.EMAIL_CODE, {
      editAccount: true,
    }));

  return (
    <Container>
      <CardsContainer>
        <CardsTitle title={i18n.t('onboarding.accountInformation')} />
        <Card
          title={i18n.t('onboarding.namePlaceholder')}
          onPress={() => navigation.navigate(MAIN_ROUTES.NAME, {
            editAccount: true,
          })
          }
        >
          {user ? `${user.firstName} ${user.lastName}` : ''}
        </Card>
        <Card
          title={i18n.t('onboarding.phonePlaceholder')}
        >
          {user ? `${user.phoneNumber}` : ''}
        </Card>
        <Card
          verified={emailIsVerified}
          showUnverified
          title={i18n.t('onboarding.emailPlaceholder')}
          onPress={onEmailPress}
        >
          {user ? `${user.email}` : ''}
        </Card>
        {defaultPaymentMethod && defaultPaymentMethod.id !== cashPaymentMethod.id ? (
          <>
            <CardsTitle title={i18n.t('onboarding.paymentInformation')} />
            <Card
              title={i18n.t('onboarding.paymentMethodPlaceholder')}
              onPress={() => navigation.navigate(MAIN_ROUTES.PAYMENT, {
                back: true,
              })}
            >
              <PaymentMethodContent>
                <PaymentIcon type={defaultPaymentMethod.brand} />
                <Type>{defaultPaymentMethod.name}</Type>
              </PaymentMethodContent>
            </Card>
          </>
        ) : undefined}
        <LogoutContainer
          onPress={() => {
            navigation.navigate(MAIN_ROUTES.LOGOUT);
          }}
        >
          <LogoutText>{i18n.t('menu.logout')}</LogoutText>
        </LogoutContainer>
        <LogoutContainer
          onPress={() => {
            setIsDeleteUserVisible(true);
          }}
        >
          <DeleteText>{i18n.t('deleteUserPopup.deleteUserTitle')}</DeleteText>
        </LogoutContainer>
        <ConfirmationPopup
          isVisible={isDeleteUserVisible}
          title={i18n.t('deleteUserPopup.deleteUserTitle')}
          text={i18n.t('deleteUserPopup.deleteAccountText')}
          confirmText={i18n.t('deleteUserPopup.confirmText')}
          cancelText={i18n.t('deleteUserPopup.cancelText')}
          type="cancel"
          useCancelTextButton
          onSubmit={async () => {
            try {
              await deleteUser();
              navigation.navigate(MAIN_ROUTES.LOGOUT);
            } catch (e) {
              console.log(e);
              setIsDeleteUserVisible(false);
              setTimeout(() => setShowError(true), Platform.OS === 'ios' ? 500 : 0);
            }
          }}
          onClose={() => setIsDeleteUserVisible(false)}
        />

        <GenericErrorPopup
          isVisible={showError}
          closePopup={() => setShowError(false)
        }
        />
      </CardsContainer>
    </Container>
  );
};

export default ({ navigation, menuSide }) => {
  const route = useRoute();

  useEffect(() => {
    if (route.params) {
      Mixpanel.pageView(route.name);
    }
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title={i18n.t('onboarding.pageTitle')}
        onIconPress={() => navigation.navigate(MAIN_ROUTES.HOME)}
        iconSide={menuSide}
      />
      <KeyboardAwareScrollView extraScrollHeight={20} enableOnAndroid>
        <AccountHeader />
        <AccountContent navigation={navigation} />
      </KeyboardAwareScrollView>
    </PageContainer>
  );
};
