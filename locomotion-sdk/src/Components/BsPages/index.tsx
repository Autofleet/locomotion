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
  padding: 20px;
`;

const MainContent = styled(View)`
  flex: 1;
  width: 100%;
  flex-direction: row;
  padding: 20px 0;
`;

const CardText = styled(View)`
  flex: 3;
`;

const CardImage = styled(View)`
  flex: 1;
`;

const Title = styled(Text)`
  padding-bottom: 3px;
  ${FONT_SIZES.H1}
  ${FONT_WEIGHTS.SEMI_BOLD}
`;

const SubTitle = styled(Text)`
  ${FONT_SIZES.H2}
  color: ${({ theme }) => theme.disabledColor};
`;

const ButtonTitle = styled(Text)`
  margin: auto;
  ${FONT_SIZES.H2}
  ${({ theme }:{ theme: any }) => `
  color: ${theme.primaryButtonTextColor}
  `};
`;

const BsPage = ({
  onSetAnotherLocation,
  image,
  children,
  TitleText,
  SubTitleText,
  ButtonText,
}: {
  onSetAnotherLocation: any,
  image: any,
  children?: any,
  TitleText: string,
  SubTitleText: string,
  ButtonText: string,
}) => (
  <Container>
    <MainContent>
      <CardText>
        <Title>{TitleText}</Title>
        <SubTitle>{SubTitleText}</SubTitle>
      </CardText>
      {image ? (
        <CardImage>
          {image}
        </CardImage>
      ) : undefined}
    </MainContent>
    {children}
    <OtherButton onPress={onSetAnotherLocation}>
      <ButtonTitle>{ButtonText}</ButtonTitle>
    </OtherButton>
  </Container>
);

BsPage.defaultProps = {
  children: undefined,
};

export default BsPage;

export const NotAvailableHere = (props: any) => (
  <BsPage
    TitleText="We are Sorry!"
    ButtonText="Set another pickup location"
    SubTitleText="Autofleet is not available in your area"
    image={(
      <SubTitle>(Image)</SubTitle>
    )}
    {...props}
  />
);


export const ConfirmPickup = (props: any) => (
  <BsPage
    TitleText="Confirm pickup"
    ButtonText="Confirm and request"
    SubTitleText="Drag map or edit address to set your pickup"
    {...props}
  />
);
