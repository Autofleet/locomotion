import styled from 'styled-components';
import RoundedButton from '../../../../Components/RoundedButton';

export const FutureRidesButton = styled.TouchableOpacity`
  height: 30;

  min-width: 115;
  background-color: #6180c0;
  margin-bottom: 8px;
  align-self: flex-end;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

export const FutureRideButtonText = styled.Text`
  color: #ffffff;
  font-size: 12px;
`;

export const Container = styled.View`
  width: 100%;
  flex-direction: column;
  padding-top: 8px;
  padding-bottom: 8px;

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
  flex: 1;
  justify-content: center;

  align-items: flex-end;
`;

export const DetailsRowContainer = styled.View`
  flex-direction: row;
`;
