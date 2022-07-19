import styled from 'styled-components';
import SvgIcon from '../SvgIcon';

export const DeleteText = styled.Text`
display: flex;
color: ${({ hasOutstansingBalance }) => (hasOutstansingBalance ? '#bcbcbc' : '#f35657')};
font-family: Inter-Regular;
font-weight: 600;
justify-content: flex-start;
margin-top: 2px;
`;

export const DeleteIcon = styled(SvgIcon)`
margin-right: 8px;
`;

export const DeleteContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
`;
