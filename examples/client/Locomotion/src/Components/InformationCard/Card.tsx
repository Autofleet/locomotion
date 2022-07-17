import React from 'react';
import propsTypes from 'prop-types';
import { View } from 'react-native';
import i18n from '../../I18n';
import {
  Arrow, ArrowContainer, CardContainer, CardContantContainer, CardText, CardTitle, CardTitleContainer, VerifyContainer, VerifyText,
} from './styled';
import { InformationCardProps } from '../InformationCard';

const Card = ({
  title,
  children,
  onPress,
  verified = false,
  showUnverified = false,
}: InformationCardProps) => (
  <CardContainer>
    <CardContantContainer>
      <CardTitleContainer>
        <CardTitle>{title}</CardTitle>
        {verified ? (
          <View>
            <VerifyContainer>
              <VerifyText>{i18n.t('onboarding.verified')}</VerifyText>
            </VerifyContainer>
          </View>
        ) : (
          <>
            {showUnverified ? (
              <View>
                <VerifyContainer unverified>
                  <VerifyText>{i18n.t('onboarding.unverified')}</VerifyText>
                </VerifyContainer>
              </View>
            ) : undefined}
          </>
        )}
      </CardTitleContainer>
      <CardText>{children}</CardText>
    </CardContantContainer>
    <ArrowContainer>{onPress ? <Arrow /> : undefined}</ArrowContainer>
  </CardContainer>
);

export default Card;
