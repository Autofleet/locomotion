/* eslint-disable react/prop-types */
import React from 'react';
import {
  CardContantContainer, CardTitleContainer,
  CardContainer, CardTitle,
} from '../../Components/InformationCard/styled';
import i18n from '../../I18n';
import {
  MethodCard,
  ChevronIcon,
  ChangeButton,
} from './styled';
import chevronIcon from '../../assets/chevron.svg';
import { HeaderLink } from '../../Components/Menu/styled';

import PaymentMethod from '../../Components/CardRow';


const Section = ({
  onPress,
  paymentMethods,
  showChangeButton = false,
  onPressChange = () => { console.log('no onPressChange'); },
}) => (
  <CardContainer>
    <CardContantContainer>
      <CardTitleContainer>
        <CardTitle>
          {i18n.t('payments.defaultMethodTitle')}
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
      {paymentMethods.map(paymentMethod => (
        <MethodCard>
          <PaymentMethod
            {...paymentMethod}
            onPress={() => onPress(paymentMethod)}
          />
          <ChevronIcon Svg={chevronIcon} stroke="#d7d7d7" style={{ marginTop: 25 }} />
        </MethodCard>
      ))
      }
    </CardContantContainer>
  </CardContainer>
);

export default Section;
