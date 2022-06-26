
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components';
import Thumbnail from '../../../Components/Thumbnail';
import i18n from '../../../I18n';
import Button from '../../../Components/RoundedButton';

const Container = styled.View`
  flex-direction: column;
`;

const Title = styled.Text`
  font-size: 20px;
  color: #333333;
  font-weight: 600;
  margin-bottom: 8px;
`;

const SubTitle = styled.Text`
  font-size: 16px;
  color: #000000;
  opacity: 0.7;
`;

const DetailsContainer = styled.View`
  flex-direction: row;
`;

const Column = styled.View`
  flex: 1;
  flex-direction: column;
`;

const ThumbnailContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 55px;
`;

const StyledThumbnail = styled(View)`
  border-color: #24aaf2;
  border-width: 4;
  border-radius: 100;
`;

const Tips = ({ driver, ridePrice, thumbnailImage }) => {
  console.log();


  return (
    <Container>
      <DetailsContainer>
        <Column>
          <Title>
            {`${i18n.t('postRide.tip.title')} Timmy`}
          </Title>
          <SubTitle>
            {`${i18n.t('postRide.tip.subTitle')} $21.50`}
          </SubTitle>
        </Column>
        <ThumbnailContainer>
          <StyledThumbnail>
            <Thumbnail size={55} />
          </StyledThumbnail>
        </ThumbnailContainer>
      </DetailsContainer>
      <DetailsContainer />


    </Container>
  );
};


export default Tips;
