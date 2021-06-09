import React,{useEffect} from 'react'
import styled from 'styled-components';
import InputIcon from '../../../../../assets/arrow-down.png';
import RNPickerSelect from 'react-native-picker-select';

const TimeSelectorItemContainer = styled.View`
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const InputSelectorContainer = styled.View`
  flex: 1;
`;

const TimeSelectorTitle = styled.Text`
  font-size: 12px;
  font-weight: 500;
  color: #000000;
`;

const InputArrow = styled.Image.attrs({ source: InputIcon })`
    height: 20px;
    width: 20px;
`;

 const TimePicker = ({
    title, items, value, onValueChange,
  }) => {
    return (
    <TimeSelectorItemContainer>
      <TimeSelectorTitle>{title}</TimeSelectorTitle>
        <RNPickerSelect
          items={items}
          onValueChange={onValueChange}
          style={{
            inputIOS: {
              fontSize: 14,
              color: '#727272',
              height: 20,
            },
            inputAndroid: {
              fontSize: 14,
              color: '#727272',
              height: 20,
              width: 180,
              marginLeft: -15,
              marginTop: -15
            },

          }}
          value={value}
          Icon={() => (<InputArrow />)}
          placeholder={{}}
        />

    </TimeSelectorItemContainer>
  );
        }

export default TimePicker