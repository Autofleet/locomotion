import React from 'react';
import { Text } from 'react-native';
import Button from '../../../Components/Button';
import SvgIcon from '../../../Components/SvgIcon';
import {
  BodyText, Container, Title, TitleText, ButtonContainer, ButtonText,
} from './styled';

const TopMessage = ({
  text, title, icon, button, onPress,
}: {
    title: any,
    text: string,
    button: any,
    icon: any,
    onPress: any,
}) => (
  text
    ? (
      <Container>
        {title && (
        <Title>
          {icon && <SvgIcon Svg={icon} height={20} width={20} style={{ marginRight: 10 }} />}
          <TitleText>{title}</TitleText>
        </Title>
        )}
        <BodyText>
          {text}
        </BodyText>
        {button && onPress && (
          <ButtonContainer>
            <Button
              noBackground
              onPress={onPress}
            >
              <ButtonText>
                {button}
              </ButtonText>
            </Button>
          </ButtonContainer>
        )}
      </Container>
    )
    : null
);

export default TopMessage;
