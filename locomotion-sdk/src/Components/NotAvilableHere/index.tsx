import React from 'react';
import styled from 'styled-components';
import { FONT_STYLES } from '../../services/sharedStyles';
import Button from '../Button';

const OtherButton = styled(Button)`
  width: 100%;
  height: 50px;
  border-radius: 8px;
  margin-top: 40px;
`;

const Container = styled.View`
  width: 100%;
  padding: 20px 0 20px 20px;
`;

const MainContent = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
  padding-top: 20px;
  padding-left: 20px;
  padding-bottom: 20px;
`;

const CardText = styled.View`
  flex: 3;
`;

const CardImage = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: ${FONT_STYLES.SIZE.LARGE};

  padding-bottom: 3px;
`;

const SubTitle = styled.Text`
  font-size: ${FONT_STYLES.SIZE.MEDIUM};
`;

const ButtonTitle = styled.Text`
  margin: auto;
  font-size: ${FONT_STYLES.SIZE.LARGE};
  ${({ theme }:{ theme: any }) => `
  color: ${theme.primaryButtonTextColor}
  `};
`;

export default () => (
  <Container>
    <MainContent>
      <CardText>
        <Title>Sorry!</Title>
        <SubTitle>Autofleet is not available in your area</SubTitle>
      </CardText>
      <CardImage />
    </MainContent>
    <OtherButton>
      <ButtonTitle>Set another pickup location</ButtonTitle>
    </OtherButton>
  </Container>
);
