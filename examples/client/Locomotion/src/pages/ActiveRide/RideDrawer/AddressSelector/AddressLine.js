import React from 'react';
import styled from 'styled-components';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import SvgIcon from '../../../../Components/SvgIcon';
import HistoryIcon from '../../../../assets/recent_search.svg';
import GeoIcon from '../../../../assets/geo_location.svg';
import LocationPinIcon from '../../../../assets/location_pin.svg';
import Button from '../../../../Components/Button';


const ICONS = {
  history: HistoryIcon,
  location: GeoIcon,
  locationPin: LocationPinIcon,
};

const Row = styled(Button)`
    min-height: 50px;
    flex-direction: column;
    flex-grow: 1;
    max-height: 70px;
    padding: 10px 0px;
    ${({ border }) => border && `
      border-bottom-color: #f1f2f6;
      border-bottom-width: 2px;
    `}
  `;

const SubRow = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    align-self: center;
    flex: 1;

`;
const IconContainer = styled.View`
    margin-right: 15px;
    align-self: center;
`;

const AddressContainer = styled.View`
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    align-self: center;
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

const Label = styled.Text`
    color:  #666666;
    font-weight: 500;
    font-size: 12px;
    line-height: 20px;
`;

const Icon = styled(SvgIcon).attrs(({ actionButton, theme }) => ({
  stroke: actionButton ? theme.primaryColor : theme.textColor,
  fill: actionButton ? theme.primaryColor : theme.textColor,
}))``;


const AddressRow = ({
  text,
  subText,
  icon = null,
  actionButton = false,
  onPress,
  isLoading = false,
  isHistory,
  testID,
  label,
  distance,
}) => {
  const finalIcon = ICONS[icon] || (isHistory && HistoryIcon);
  const isDebuggingEnabled = (typeof atob !== 'undefined');
  return (
    <Row
      testID={testID}
      border
      onPress={onPress}
      noBackground
    >
      <SubRow>
        <IconContainer>
          {finalIcon
            ? (
              <Icon
                Svg={finalIcon}
                height={20}
                width={20}
                actionButton={actionButton}
              />
            )
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
              {label ? <Label>{label}</Label> : null}
              {actionButton ? <ActionText>{text}</ActionText> : <AddressText>{text}</AddressText>}
              {subText ? <AddressText subtext>{subText}</AddressText> : null}
            </>
          )}
        </AddressContainer>
        <IconContainer>
          <AddressText subtext>{distance}</AddressText>
        </IconContainer>
      </SubRow>
    </Row>
  );
};

export default AddressRow;
