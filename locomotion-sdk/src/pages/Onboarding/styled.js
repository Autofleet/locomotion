import { Dimensions } from 'react-native';
import styled from 'styled-components';
import { padding, inputHeight } from '../../assets/style-settings';

const drawerWidth = Dimensions.get('window').height;

const loginTextColor = '#7c8799';

export const FullNameContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const SubmitContainer = styled.View`
  width: 90%;
`;

export const Container = styled.View`
  background-color: white;
  flex: 1;
  color: ${loginTextColor};
  /* margin-top: 100px; */
  text-align: center;
  align-items: center;
  padding: ${padding};
`;
