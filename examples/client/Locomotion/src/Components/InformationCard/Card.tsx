import React from 'react';
import { View } from 'react-native';
import { TouchableIconContainer } from '../TextInput/styled';
import SvgIcon from '../SvgIcon';
import i18n from '../../I18n';
import {
  Arrow, ArrowContainer, CardContainer, CardContentContainer, CardText, CardTitle, CardTitleContainer, VerifyContainer, VerifyText,
  IconContainer,
} from './styled';
import { InformationCardProps } from '../InformationCard';

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
    <CardContentContainer>
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
      {children ? <CardText>{children}</CardText> : undefined}
    </CardContentContainer>
    {icon ? (
      <TouchableIconContainer onPress={onIconPress}>
        <IconContainer>
          <SvgIcon Svg={icon} fill="#333" />
        </IconContainer>
      </TouchableIconContainer>
    )
      : <ArrowContainer>{onPress ? <Arrow /> : undefined}</ArrowContainer>}
  </CardContainer>
);

export default Card;
