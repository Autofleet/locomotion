import styled from 'styled-components';
const ArrowIconSource = require('../../assets/arrowright.png');

const defaultTextColor = '#686868';
const drawerPadding = 26;

export const DrawerIcon = styled.Image`
  width: 23px;
  height: 23px;
  margin-right: 20px;
  opacity: 0.6;
`;

export const Arrow = styled.Image.attrs({ source: ArrowIconSource })`
  opacity: 0.4;
  margin-right: 10px;
  margin-left: auto;
  width: 10px;
  height: 10px;

`;

export const LabelText = styled.Text`
  color: ${defaultTextColor};
  height: 30px;
  line-height: 30px;
`;

export const StyledDrawerLabel = styled.View`
  border-color: #dfdfdf;
  border-bottom-width: 1px;
  padding: ${drawerPadding}px 10px;
  width: 100%;
  flex-direction: row;
  flex: 1;
  background-color: #ffffff;
  align-items: center;
`;
