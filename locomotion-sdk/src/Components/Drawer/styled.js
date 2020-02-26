import styled from 'styled-components';
const ArrowIconSource = require('../../assets/arrowright.png');

const defaultTextColor = '#686868';
const drawerPadding = 25;

export const DrawerIcon = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: 20px;
  opacity: 0.6;
`;

export const Arrow = styled.Image.attrs({ source: ArrowIconSource })`
  position: absolute;
  right: 0;
  top: ${(drawerPadding + 6)}px;
  opacity: 0.4;
  margin-right: 10px;
  width: 10px;
  height: 10px;
`;

export const LabelText = styled.Text(props => `
  color: ${props.color || defaultTextColor};
  margin-top: 1px;
`);

export const StyledDrawerLabel = styled.View`
  margin: 0 35px;
  border-color: #dfdfdf;
  border-bottom-width: 1px;
  padding: ${drawerPadding}px;
  width: 100%;
  flex-direction: row;
  flex: 1;
`;
