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
  showChangeButton = false,
  title,
  onPressChange = () => { console.log('no onPressChange'); },
  children,
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
              <ChangeButton>
                {i18n.t('payments.changeDefault')}
              </ChangeButton>
            )

            : undefined}
        </HeaderLink>
      </CardTitleContainer>
      <CardContentContainer>
        {children}
      </CardContentContainer>
    </View>
  </PaymentCardContainer>
);

export default Section;
