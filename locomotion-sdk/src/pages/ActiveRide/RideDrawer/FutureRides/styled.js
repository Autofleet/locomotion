import styled from 'styled-components';
import RoundedButton from '../../../../Components/RoundedButton';
import xIconWhite from '../../../../assets/x-white.png'

export const FutureRidesButton = styled.TouchableOpacity`
  height: 30px;
  min-width: 115px;
  background-color: #6180c0;
  margin-bottom: 8px;
  align-self: flex-end;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding-right: 8px;
  padding-left: 8px;
`;

export const FutureRideButtonText = styled.Text`
  color: #ffffff;
  font-size: 13px;
  text-align: center;
`;

export const Container = styled.View`
  width: 100%;
  flex-direction: column;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-right: 8px;
  padding-left: 8px;
  background-color: #ffffff;
  border-radius: 4;
  margin-bottom: 5px;
`;

export const DateTitle = styled.Text`
  font-size: 11;
  color: #000000;
  margin-start: 22;
  margin-end: 16;
  font-weight: 500;
  margin-bottom: 5px;
`;

export const SpsContainer = styled.View`
  flex: 2;
  flex-direction: column;
`;

export const CancelContainer = styled.View`

  justify-content: center;

  align-items: flex-end;
`;

export const DetailsRowContainer = styled.View`
  flex-direction: row;
`;

export const CloseIconContainer = styled.View`
  margin-left: 10px;
  max-width: 20px;
`;

export const CloseIcon = styled.Image.attrs({ source: xIconWhite })`
    height: 20px;
    width: 20px;
`;
