import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';

const defaultTextColor = '#686868';
const iconTopPadding = 25;

export const HeaderText = styled.Text(props => `
  color: ${props.color || defaultTextColor};
  font-weight: bold;
  text-align: center;
  font-size: 16px;
`);

export const HeaderIconContainer = styled(TouchableOpacity)(({ side }) => `
  padding: 5px;
  position: absolute;
  top: 10px;

  right: ${side === 'right' ? 0 : null};
  margin-right: ${side === 'right' ? 30 : null};

  left: ${side === 'left' ? 0 : null};
  margin-left: ${side === 'left' ? 13 : null};
`);

export const HeaderIcon = styled.Image(({ side }) => `
  width: 18px;
  height: 18px;
`);

export const Header = styled.View`
text-align: center;
padding: 15px;
background-color: #ffffff;
`;