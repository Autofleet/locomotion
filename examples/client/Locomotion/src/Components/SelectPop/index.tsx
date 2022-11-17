import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components';
import SelectDropdown from 'react-native-select-dropdown';
import SvgIcon from '../SvgIcon';
import person from '../../assets/person.svg';
import close from '../../assets/close-x.svg';
import {
  FONT_SIZES, FONT_SIZES_VALUES, FONT_WEIGHTS,
} from '../../context/theme';

const hextToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b},${alpha}`;
};

const ERROR_COLOR = '#f35657';
const StyledPop = styled(SelectDropdown).attrs(({ theme, icon = person, error }) => ({
  buttonStyle: {
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: !error ? '#f1f2f6' : ERROR_COLOR,
  },
  buttonTextStyle: {
    fontSize: FONT_SIZES_VALUES.H3,
    color: theme.textColor,
  },
  renderDropdownIcon: () => (
    <SvgIcon
      Svg={icon}
      fill={!error ? theme.textColor : ERROR_COLOR}
      width={16}
      height={16}
    />
  ),
  rowStyle: {
    height: 40,
  },

}))``;


const StyledRow = styled(View)`
  height: 40;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 8;
  background-color: ${({ theme, selected }) => (selected ? `rgba(${hextToRgba(theme.primaryColor, 0.1)})` : '#ffffff')};
`;

const StyledText = styled(Text)`
  ${FONT_SIZES.H3};
  text-align: center;
  flex: 1;
  margin-horizontal: 8;
  color: ${({ theme }) => theme.textColor};
  ${({ selected }) => selected && `${FONT_WEIGHTS.BOLD}`}
`;

const StyledIcon = styled(SvgIcon).attrs(({
  theme, fillColor, width, height, selected,
}) => ({
  fill: fillColor || (selected ? theme.primaryColor : theme.textColor),
  width: width || 16,
  height: height || 16,
}))``;


const StyledSelectRow = ({ item, theme, selected }) => (
  <StyledRow selected={selected}>
    <StyledIcon
      Svg={person}
      selected={selected}
    />
    <StyledText selected={selected}>{item.label}</StyledText>

  </StyledRow>

);
const SelectPop = ({ data, onSelect, onError }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (data && data.length) {
      if (!selectedItem) {
        setSelectedItem(data[0]);
      } else {
        setError(!(data.find(item => item.value === selectedItem.value)));
      }
    }
  }, [data, selectedItem]);

  useEffect(() => {
    onError(error);
  }, [error]);

  return (
    <StyledPop
      error={error}
      data={data}
      defaultButtonText={selectedItem?.label || '1'}
      onSelect={(item, index) => {
        console.log(item);
        setSelectedItem(item);
      }}
      dropdownIconPosition="left"
      dropdownOverlayColor="transparent"
      buttonTextAfterSelection={(item, index) => item.value}
      renderCustomizedRowChild={(item, index) => (
        <StyledSelectRow
          item={item}
          index={index}
          selected={selectedItem && item.value === selectedItem.value}
        />
      )}
    />
  );
};

export default SelectPop;
