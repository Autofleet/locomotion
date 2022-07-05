import React from 'react';
import styled from 'styled-components';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import SvgIcon from '../../../../Components/SvgIcon';
import HistoryIcon from '../../../../assets/recent_search.svg';
import GeoIcon from '../../../../assets/geo_location.svg';
import LocationPinIcon from '../../../../assets/location_pin.svg';


const ICONS = {
  history: HistoryIcon,
  location: GeoIcon,
  locationPin: LocationPinIcon,
};

const Row = styled.TouchableOpacity`
    width: 100%;
    min-height: 50px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 0px;
    ${({ border }) => border && `
      border-bottom-color: #f1f2f6;
      border-bottom-width: 2px;
    `}
  `;

const IconContainer = styled.View`
    width: 25px;
    height: 25px;
    margin-right: 15px;
`;

const Icon = styled(SvgIcon).attrs(({ actionButton, theme }) => ({
  stroke: actionButton ? theme.primaryColor : theme.textColor,
  fill: actionButton ? theme.primaryColor : theme.textColor,
}))``;

const AddressContainer = styled.View`
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
`;

const AddressText = styled.Text`
    color: ${({ subtext, actionButton, theme }) => (!subtext ? (actionButton ? theme.primaryColor : theme.textColor) : '#666666')};
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
`;

const ActionText = styled.Text`
    color: ${({ theme }) => theme.primaryColor};
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
`;

const AddressRow = ({
  text,
  subText,
  icon = null,
  actionButton = false,
  onPress,
  isLoading = false,
}) => {
  const finalIcon = ICONS[icon] || HistoryIcon;
  const isDebuggingEnabled = (typeof atob !== 'undefined');
  return (
    <Row
      border
      onPress={onPress}
    >
      <IconContainer>
        {finalIcon
          ? <Icon Svg={finalIcon} height={20} width={20} actionButton={actionButton} />
          : null}
      </IconContainer>
      <AddressContainer>
        {isLoading && !isDebuggingEnabled ? (
          <SkeletonContent
            containerStyle={{}}
            isLoading
            layout={[
              { width: 180, height: 20, marginBottom: 6 },
              { width: 220, height: 20 },
            ]}
          />
        ) : (
          <>
            {actionButton ? <ActionText>{text}</ActionText> : <AddressText>{text}</AddressText>}
            {subText ? <AddressText subtext>{subText}</AddressText> : null}
          </>
        )}
      </AddressContainer>
    </Row>
  );
};

export default AddressRow;
