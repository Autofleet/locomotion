import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import i18n from '../../I18n';
import {
  CreditCardRow,
  CreditCardImage,
  CreditCardRowText,
  CreditCardContainer,
  DeleteCreditCard,
  DeleteCreditCardText,
  CardsListContainer,
} from './styled';

import PaymentMethod from '../../Components/CardRow';
import PaymentsContext from '../../context/payments';
import { PaymentMethodInterface } from '../../context/payments/interface';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { MAIN_ROUTES } from '../../pages/routes';

import RoundedButton from '../../Components/RoundedButton';
import { FlexCont } from '../../Components/Flex';
import { RidePageContext } from '../../context/newRideContext';

export default ({
  paymentMethods = [],
  onDetach = () => null,
  loadingState = false,
  onAddClick = undefined,
}) => {
  const [loading, setLoading] = useState(false);
  const usePayments = PaymentsContext.useContainer();
  
  type Nav = {
    navigate: (value: string) => void;
  }
  
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    setLoading(loadingState);
  }, [loading]);

  return (
    <CardsListContainer>
      <View>
        {[...usePayments.paymentMethods].map((paymentMethod, i) => (
          <PaymentMethod
            {...paymentMethod}
          />
        ))}
      </View>
      {onAddClick ? (
        <PaymentMethod
        addNew
        onPress={onAddClick}
      />
      ) : undefined}
    </CardsListContainer>
  );
};