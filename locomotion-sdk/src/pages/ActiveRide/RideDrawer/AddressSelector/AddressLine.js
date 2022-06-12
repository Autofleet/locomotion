import React, {
    useCallback, useEffect, useMemo, useRef, useState,
  } from 'react';
  import { View, Text, StyleSheet } from 'react-native';
  import styled from 'styled-components';
  import TextInput from '../../../../Components/TextInput';
  import i18n from '../../../../I18n';
  import SvgIcon from '../../../../Components/SvgIcon';


import HistoryIcon from '../../../../assets/history.png';

const ICONS = {
  history: HistoryIcon,
};

const DEFAULT_ICON = ICONS.history;

  const Row = styled.View`
    width: 100%;
    min-height: 50px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-bottom-color: #f1f2f6;
    border-bottom-width: 2px;
    padding: 10px 0px;
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
    color: ${({ subtext }) => (!subtext ? '#333333' : '#666666')};
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

export default AddressRow;
