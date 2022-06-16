import React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';
import Button from '../Button';
import i18n from '../../I18n';

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
  display: flex;
  flex-direction: row;
  padding: 20px 0;
`;

const CardText = styled(View)`
  flex: 3;
`;

const CardImage = styled(View)`
  flex: 3;
  justify-content: center;
  align-items: center;
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
  onButtonPress,
  image,
  children,
  TitleText,
  SubTitleText,
  ButtonText,
}: {
  onButtonPress: any,
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
    <OtherButton onPress={onButtonPress}>
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
    TitleText={i18n.t('bottomSheetContent.notAvailableHere.titleText')}
    ButtonText={i18n.t('bottomSheetContent.notAvailableHere.buttonText')}
    SubTitleText={i18n.t('bottomSheetContent.notAvailableHere.subTitleText')}
    {...props}
  />
);

export const ConfirmPickup = (props: any) => (
  <BsPage
    TitleText={i18n.t('bottomSheetContent.confirmPickup.titleText')}
    ButtonText={i18n.t('bottomSheetContent.confirmPickup.buttonText')}
    SubTitleText={i18n.t('bottomSheetContent.confirmPickup.subTitleText')}
    {...props}
  />
);
