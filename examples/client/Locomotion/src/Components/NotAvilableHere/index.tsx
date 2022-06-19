import React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';
import Button from '../Button';

const OtherButton = styled(Button)`
  width: 100%;
  height: 50px;
  border-radius: 8px;
  margin-top: 40px;
`;

const Container = styled(View)`
  width: 100%;
  padding: 20px 0 20px 20px;
`;

const MainContent = styled(View)`
  flex: 1;
  width: 100%;
  flex-direction: row;
  padding-top: 20px;
  padding-left: 20px;
  padding-bottom: 20px;
`;

const CardText = styled(View)`
  flex: 3;
`;

const CardImage = styled(View)`
  flex: 1;
`;

const Title = styled(Text)`
  padding-bottom: 3px;
  ${FONT_SIZES.LARGE}
  ${FONT_WEIGHTS.MEDIUM}
`;

const SubTitle = styled(Text)`
  ${FONT_SIZES.MEDIUM}
`;

const ButtonTitle = styled(Text)`
  margin: auto;
  ${({ theme }:{ theme: any }) => `
  color: ${theme.primaryButtonTextColor}
  `};
`;

export default ({ onSetAnotherLocation } : { onSetAnotherLocation: any }) => (
  <Container>
    <MainContent>
      <CardText>
        <Title>Sorry!</Title>
        <SubTitle>Autofleet is not available in your area</SubTitle>
      </CardText>
      <CardImage />
    </MainContent>
    <OtherButton onPress={onSetAnotherLocation}>
      <ButtonTitle>Set another pickup location</ButtonTitle>
    </OtherButton>
  </Container>
);
