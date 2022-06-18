import styled from 'styled-components';
import {padding} from '../../assets/style-settings';

const loginTextColor = '#7c8799';

export const Container = styled.View`
  background-color: white;
  height: 100%;
  color: ${loginTextColor};
  text-align: center;
  align-items: center;
  padding: ${padding};
`;

export const LockTextContainer = styled.View`
  width: 100%;
  padding: 0px 15px;
  max-height: 400px;
  height: 230px;
  margin-top: 150px;
`;

export const Text = styled.Text`
  color: ${loginTextColor};
  text-align: center;
`;

export const SubText = styled(Text)`
  margin-top: 25px;
`;

export const ButtonContainer = styled.View`
  position: absolute;
  bottom: 15px;
  width: 100%;
`;

export const HeaderText = styled(Text)`
  font-weight: 700;
  margin-top: 25px;
`;
