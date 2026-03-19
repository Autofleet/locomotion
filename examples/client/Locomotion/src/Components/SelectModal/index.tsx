import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components';
import SelectDropdown from 'react-native-select-dropdown';
import SvgIcon from '../SvgIcon';
import person from '../../assets/person.svg';
import {
  FONT_SIZES, FONT_SIZES_VALUES, FONT_WEIGHTS, convertHextToRgba,
} from '../../context/theme';

const ERROR_COLOR = '#f35657';

interface StyledPopProps {
  icon?: React.FC;
  error?: boolean;
}

const StyledPop = styled(SelectDropdown).attrs<StyledPopProps>(({ theme, icon = person, error }: StyledPopProps & { theme: { textColor: string } }) => ({
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
}))<StyledPopProps>``;

const StyledRow = styled(View)<{ selected: boolean }>`
  height: 40;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 8;
  background-color: ${({ theme, selected }: { theme: { primaryColor: string }; selected: boolean }) => (selected ? `rgba(${convertHextToRgba(theme.primaryColor, 0.1)})` : '#ffffff')};
  border-width: 1;
  border-color: #f1f2f6;
`;

const StyledText = styled(Text)<{ selected: boolean }>`
  ${FONT_SIZES.H3};
  text-align: center;
  flex: 1;
  margin-horizontal: 8;
  color: ${({ theme }: { theme: { textColor: string } }) => theme.textColor};
  ${({ selected }: { selected: boolean }) => selected && `${FONT_WEIGHTS.BOLD}`}
`;

interface StyledIconProps {
  fillColor?: string;
  selected?: boolean;
}

const StyledIcon = styled(SvgIcon).attrs<StyledIconProps>(({
  theme, fillColor, width, height, selected,
}: StyledIconProps & { theme: { primaryColor: string; textColor: string }; width?: number; height?: number }) => ({
  fill: fillColor || (selected ? theme.primaryColor : theme.textColor),
  width: width || 16,
  height: height || 16,
}))<StyledIconProps>``;

interface StyledSelectRowProps {
  item: { label: string; icon?: React.FC };
  selected: boolean;
}

function StyledSelectRow({ item, selected }: StyledSelectRowProps) {
  return (
    <StyledRow selected={selected}>
      <StyledIcon
        Svg={person}
        selected={selected}
      />
      <StyledText selected={selected}>{item.label}</StyledText>

    </StyledRow>
  );
}

interface Item {
  value: string | number;
  label: string;
}

interface SelectModalProps {
  data: Item[];
  selectedValue?: string | number | null;
  onSelect: (item: Item) => void;
  onError: (error: boolean) => void;
}

function SelectModal({
  data, onSelect, onError, selectedValue = null,
}: SelectModalProps) {
  const [selectedItem, setSelectedItem] = useState<Item| null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (data?.length) {
      const defaultItem = data.find((i) => i.value === selectedValue);
      if (defaultItem) {
        setSelectedItem(defaultItem);
      } else {
        setSelectedItem(data[0]);
      }
    }
  }, [data.length, selectedValue]);

  useEffect(() => {
    onError(error);
  }, [error]);

  useEffect(() => {
    if (selectedItem) {
      onSelect(selectedItem);
      setError(!(data.find((item) => item.value === selectedItem.value)));
    }
  }, [selectedItem]);

  return (
    <StyledPop
      error={error}
      data={data}
      defaultValue={selectedItem}
      defaultButtonText={selectedItem?.label || '1'}
      onSelect={(item: Item) => {
        setSelectedItem(item);
      }}
      dropdownIconPosition="left"
      dropdownOverlayColor="transparent"
      rowTextForSelection={(item: Item) => item.label}
      buttonTextAfterSelection={(item: Item) => item.label}
      renderCustomizedRowChild={(item: Item) => (
        <StyledSelectRow
          item={item}
          selected={selectedItem !== null && item.value === selectedItem.value}
        />
      )}
    />
  );
}
export default SelectModal;
