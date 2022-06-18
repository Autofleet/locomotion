import {View, Text, Dimensions} from 'react-native';
import styled from 'styled-components';

export const PageContent = styled(View)`
  width: 100%;
  height: 100%;
`;

export const NoRidesMessageContainer = styled(View)`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
`;

export const NoRidesTitle = styled(View)`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const NoRidesTitleText = styled(Text)`
  text-align: center;
  font-size: 20px;
  font-weight: 700;
`;

export const NoRidesTitleSubText = styled(Text)`
  color: grey;
  font-size: 16px;
  font-weight: 400;
`;
