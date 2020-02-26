import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';

const defaultTextColor = '#686868';
const iconTopPadding = 25;

export const HeaderText = styled.Text(props => `
  color: ${props.color || defaultTextColor};
  font-weight: bold;
  text-align: center;
`);

export const HeaderIconContainer = styled(TouchableOpacity)(({ side }) => `
  position: absolute;
  top: 11px;

  right: ${side === 'right' ? 0 : null};
  margin-right: ${side === 'right' ? 30 : null};

  left: ${side === 'left' ? 0 : null};
  margin-left: ${side === 'left' ? 13 : null};
`);

export const HeaderIcon = styled.Image(({ side }) => `
  width: ${side === 'left' ? 19 : 13};
  height: ${side === 'left' ? 19 : 13};
`);

export const Header = styled.View`
text-align: center;
padding: 10px;
background-color: #ffffff;
`;