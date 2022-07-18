import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import SvgIcon from '../SvgIcon';
import i18n from '../../I18n';
import {
  Arrow, ArrowContainer, CardContainer, CardContantContainer, CardText, CardTitle, CardTitleContainer, VerifyContainer, VerifyText,
} from './styled';
import { InformationCardProps } from '../InformationCard';
import { ButtonContainer } from '../../pages/Lock/styled';

const Card = ({
  title,
  children,
  onPress,
  verified = false,
  showUnverified = false,
  icon = undefined,
  onIconPress,
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
    {icon ? <TouchableOpacity onPress={onIconPress}><SvgIcon Svg={icon} fill="#333" /></TouchableOpacity>
      : <ArrowContainer>{onPress ? <Arrow /> : undefined}</ArrowContainer>}
  </CardContainer>
);

export default Card;
