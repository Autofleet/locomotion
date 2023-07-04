/* eslint-disable react/prop-types */
import React from 'react';
import { View } from 'react-native';
import {
  CardContentContainer, CardTitleContainer, CardTitle,
} from '../../Components/InformationCard/styled';
import i18n from '../../I18n';
import {
  MethodCard,
  ChangeButton,
  PaymentCardContainer,
} from './styled';
import { HeaderLink } from '../../Components/Menu/styled';

import PaymentMethod from '../../Components/CardRow';


const Section = ({
  onPress,
  paymentMethods,
  showChangeButton = false,
  title,
  onPressChange = () => { console.log('no onPressChange'); },
}) => (
  <PaymentCardContainer>
    <View>
      <CardTitleContainer>
        <CardTitle>
          {title}
        </CardTitle>
        <HeaderLink onPress={onPressChange}>
          {showChangeButton
            ? (
              <ChangeButton
                testID="Change"
              >
                {i18n.t('payments.changeDefault')}
              </ChangeButton>
            )

            : undefined}
        </HeaderLink>
      </CardTitleContainer>
      <CardContentContainer>
        {paymentMethods.map(paymentMethod => (
          <MethodCard>
            <PaymentMethod
              {...paymentMethod}
              onPress={() => onPress(paymentMethod)}
              showArrow
            />
          </MethodCard>
        ))
      }
      </CardContentContainer>
    </View>
  </PaymentCardContainer>
);

export default Section;
