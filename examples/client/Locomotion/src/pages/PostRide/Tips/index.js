
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import Thumbnail from '../../../Components/Thumbnail';
import i18n from '../../../I18n';
import SelectableButton from '../../../Components/SelectableButton';

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
  justify-content: space-between;
  width: 100%;
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

const CustomTipText = styled.Text`
  color: ${({ theme }) => theme.primaryColor};
  padding: 10px;
  font-size: 16px;
`;

const CustomTipContainer = styled.View`
  display: flex;
  width: 100%;
  align-items: center;
`;

const CustomTip = ({ onPress, children }) => (
  <CustomTipContainer>
    <TouchableOpacity onPress={onPress}>
      <CustomTipText>{children}</CustomTipText>
    </TouchableOpacity>
  </CustomTipContainer>
);

const Tips = ({ driver = { firstName: 'Timmy' }, ridePrice = 33, thumbnailImage }) => {
  const [selectedTip, setSelectedTip] = useState(null);
  const settings = {
    percentageThreshold: 30,
    percentage: [10, 15, 20],
    fixedPrice: [1, 2, 5],
  };
  const isPercentage = ridePrice >= settings.percentageThreshold;
  const buttons = isPercentage ? settings.percentage : settings.fixedPrice;
  const tipSuffix = isPercentage ? '%' : '$';

  return (
    <Container>
      <DetailsContainer>
        <Column>
          <Title>
            {`${i18n.t('postRide.tip.title')} ${driver.firstName}`}
          </Title>
          <SubTitle>
            {`${i18n.t('postRide.tip.subTitle')} ${ridePrice}$`}
          </SubTitle>
        </Column>
        <ThumbnailContainer>
          <StyledThumbnail>
            <Thumbnail size={55} />
          </StyledThumbnail>
        </ThumbnailContainer>
      </DetailsContainer>
      <DetailsContainer style={{ marginTop: 30 }}>
        {buttons.map(b => (
          <SelectableButton selected={b === selectedTip} onPress={() => setSelectedTip(b)}>
            {`${b}${tipSuffix}`}
          </SelectableButton>
        ))}
      </DetailsContainer>
      <DetailsContainer style={{ marginTop: 5 }}>
        <SelectableButton onPress={() => setSelectedTip(null)}>{`${i18n.t('postRide.tip.noTip')}`}</SelectableButton>
      </DetailsContainer>
      <DetailsContainer style={{ marginTop: 30 }}>
        <CustomTip>{i18n.t('postRide.tip.customTip')}</CustomTip>
      </DetailsContainer>


    </Container>
  );
};


export default Tips;
