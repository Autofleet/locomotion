import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import i18n from '../../I18n';
import {
  Arrow, ArrowContainer, CardContainer, CardContantContainer, CardText, CardTitle, CardTitleContainer, VerifyContainer, VerifyText,
} from './styled';

const Card = ({
  title = '',
  children = {},
  onPress = null,
  verified = false,
  showUnverified = false,
  ...props
}) => {
  const MainContainer = onPress ? TouchableOpacity : View;
  return (
    <MainContainer onPress={onPress} {...props}>
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
    </MainContainer>
  );
};
export default Card;
