import React, { useEffect, useContext, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PaymentIcon } from 'react-native-payment-icons';
import { Platform } from 'react-native';
import Auth from '../../services/auth';
import Button from '../../Components/Button';
import ConfirmationPopup from '../../popups/ConfirmationPopup';
import Card from '../../Components/InformationCard';
import PaymentsContext from '../../context/payments';
import { MAIN_ROUTES } from '../routes';
import * as navigationService from '../../services/navigation';
import ThumbnailPicker from '../../Components/ThumbnailPicker';
import LanguageSelectorPopup from '../../popups/Selector';

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
import i18n, { supportedLanguages, getPreferredLanguageCode, updateLanguage } from '../../I18n';
import PageHeader from '../../Components/PageHeader';
import CardsTitle from '../../Components/CardsTitle';
import Mixpanel from '../../services/Mixpanel';
import { PageContainer } from '../styles';
import { UserContext } from '../../context/user';
import GenericErrorPopup from '../../popups/GenericError';
import { PAYMENT_METHODS } from '../../pages/Payments/consts';

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

const AccountContent = ({ setHeaderTitle }) => {
  const [showError, setShowError] = useState(false);
  const [isDeleteUserVisible, setIsDeleteUserVisible] = useState(false);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(null);
  const [chosenLanguageIndex, setChosenLanguageIndex] = useState(0);
  const [isLanguagePickerVisible, setLanguagePickerVisible] = useState(false);

  const { user, deleteUser, verifyEmail } = useContext(UserContext);
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
  const onEmailPress = () => {
    if (emailIsVerified) {
      navigationService.navigate(MAIN_ROUTES.EMAIL, {
        editAccount: true,
      });
    } else {
      verifyEmail();
      navigationService.navigate(MAIN_ROUTES.EMAIL_CODE, {
        editAccount: true,
      });
    }
  };

  const languageItems = Object.entries(supportedLanguages).map(([key, val]) => ({
    label: val.label,
    value: key,
  }));

  const fetchLanguageCode = async () => {
    const preferred = await getPreferredLanguageCode();
    setChosenLanguageIndex(languageItems.findIndex(l => l.value === preferred));
  };

  const openLanguageSelector = () => {
    Mixpanel.clickEvent('language selector');
    setLanguagePickerVisible(true);
  };

  useEffect(() => {
    fetchLanguageCode();
  }, []);

  return (
    <Container>
      <CardsContainer>
        <CardsTitle title={i18n.t('onboarding.accountInformation')} />
        <Card
          testID="goToName"
          title={i18n.t('onboarding.namePlaceholder')}
          onPress={() => navigationService.navigate(MAIN_ROUTES.NAME, {
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
          testID="goToEmail"
          verified={emailIsVerified}
          showUnverified
          title={i18n.t('onboarding.emailPlaceholder')}
          onPress={onEmailPress}
        >
          {user ? `${user.email}` : ''}
        </Card>
        <Card
          testID="chooseLanguage"
          title={i18n.t('onboarding.chooseLanguage')}
          onPress={openLanguageSelector}
        >

          {languageItems[chosenLanguageIndex].label}
        </Card>
        {defaultPaymentMethod && defaultPaymentMethod.id !== PAYMENT_METHODS.CASH ? (
          <>
            <CardsTitle title={i18n.t('onboarding.paymentInformation')} />
            <Card
              testID="goToPaymentMethod"
              title={i18n.t('onboarding.paymentMethodPlaceholder')}
              onPress={() => navigationService.navigate(MAIN_ROUTES.PAYMENT, {
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
        <LogoutContainer>
          <Button
            noBackground
            testID="logout"
            onPress={() => {
              navigationService.navigate(MAIN_ROUTES.LOGOUT);
            }}
          >
            <LogoutText>{i18n.t('menu.logout')}</LogoutText>
          </Button>
        </LogoutContainer>
        <LogoutContainer>
          <Button
            noBackground
            testID="deleteAccount"
            onPress={() => {
              setIsDeleteUserVisible(true);
            }}
          >
            <DeleteText>{i18n.t('deleteUserPopup.deleteUserTitle')}</DeleteText>
          </Button>
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
              await Auth.logout();
            } catch (e) {
              console.log(e);
              setIsDeleteUserVisible(false);
              setTimeout(() => setShowError(true), Platform.OS === 'ios' ? 500 : 0);
            }
          }}
          onClose={() => setIsDeleteUserVisible(false)}
        />
        <LanguageSelectorPopup
          isVisible={isLanguagePickerVisible}
          items={languageItems}
          onCancel={() => setLanguagePickerVisible(false)}
          onSubmit={(id) => {
            setChosenLanguageIndex(id);
            updateLanguage(languageItems[id].value, () => {
              setHeaderTitle(i18n.t('onboarding.pageTitle'));
            });
          }}
          selected={chosenLanguageIndex}
          title={i18n.t('popups.chooseLanguage.title')}
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
  const [headerTitle, setHeaderTitle] = useState(i18n.t('onboarding.pageTitle'));
  return (
    <PageContainer>
      <PageHeader
        title={headerTitle}
        onIconPress={() => navigationService.navigate(MAIN_ROUTES.HOME)}
        iconSide={menuSide}
      />
      <KeyboardAwareScrollView extraScrollHeight={20} enableOnAndroid>
        <AccountHeader />
        <AccountContent navigation={navigation} setHeaderTitle={setHeaderTitle} />
      </KeyboardAwareScrollView>
    </PageContainer>
  );
};
