import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import i18n from '../../I18n';
import {
  DeleteCreditCard,
  DeleteCreditCardText,
  CardsListContainer,
} from './styled';

import PaymentMethod from '../../Components/CardRow';
import PaymentsContext from '../../context/payments';
import { PaymentMethodInterface } from '../../context/payments/interface';

export default ({
  onDetach = (id: string) => null,
  loadingState = false,
  onAddClick = undefined,
}) => {
  const [loading, setLoading] = useState(false);
  const usePayments = PaymentsContext.useContainer();


const cashPaymentMethod = {
  id: 'cash',
  name: 'Cash',
  brand: 'cash'
}
  
  useEffect(() => {
    setLoading(loadingState);
  }, [loading]);

  return (
    <CardsListContainer>
      <View>
     
        {[...usePayments.paymentMethods, cashPaymentMethod].map((paymentMethod : any, i) => (
             <View style={{display: 'flex', height: 100, flexDirection: 'row'}} >
               <View style={{flex: 1}}>
          <PaymentMethod 
            {...paymentMethod}
          />
          </View>
          <View style={{ flex: 1}}>
          <DeleteCreditCard disabled={loading}>
            <DeleteCreditCardText
              onPress={() => onDetach(paymentMethod.id)}
            >
              {i18n.t('payments.deleteCard')}
            </DeleteCreditCardText>
          </DeleteCreditCard>   
</View>
            </View>
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
