import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styled from 'styled-components';
import TextInput from '../../../../Components/TextInput';
import i18n from '../../../../I18n';
import SvgIcon from '../../../../Components/SvgIcon';


import HistoryIcon from '../../../../assets/history.png';
import GeoIcon from '../../../../assets/geo_location.png';
import carIcon from '../../../../assets/geo_location.svg';

const ICONS = {
  history: HistoryIcon,
location: GeoIcon,
};

const DEFAULT_ICON = ICONS.history;

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

const Icon = styled.Image.attrs(({ icon }) => ({ source: ICONS[icon] || DEFAULT_ICON }))`
  width: 25px;
  height: 25px;
`;

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
    color: ${({ subtext, actionButton, theme }) => theme.primaryColor};
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
`;

const AddressRow = ({ text, subText, icon }) => (
  <Row>
    <IconContainer>
      <Icon icon={icon} />
    </IconContainer>
    <AddressContainer>
      <AddressText>{text}</AddressText>
      <AddressText subtext>{subText}</AddressText>
    </AddressContainer>
  </Row>
);
const AddressRow = ({
  text,
  subText,
  icon = null,
  border = true,
  actionButton = false,
}) => (
  <Row border>
    <IconContainer>
      {icon ? <Icon icon={icon} /> : null}
      {/* <SvgIcon svg={carIcon} width={30} height="30px" stroke="red" fill="green" /> */}
    </IconContainer>
    <AddressContainer>
      {actionButton ? <ActionText>{text}</ActionText> : <AddressText>{text}</AddressText>}
      {subText ? <AddressText subtext>{subText}</AddressText> : null}
    </AddressContainer>
  </Row>
);


export default AddressRow;
