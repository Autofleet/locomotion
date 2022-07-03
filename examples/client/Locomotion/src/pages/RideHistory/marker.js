import styled from 'styled-components';
import DropoffIcon from '../../assets/map/markers/dropoffIcon-nocolor.svg';
import PickupIcon from '../../assets/map/markers/pickupIcon-nocolor.svg';

export const PickupIconMarker = styled(PickupIcon).attrs(({ theme }) => ({
  height: '15px',
  fill: theme.primaryColor,
  width: '15px',
}))`
  ${({ theme, onMap }) => (onMap ? '' : `background-color: ${theme.pageBackgroundColor};`)}
`;

export const DropoffIconMarker = styled(DropoffIcon).attrs(({ theme }) => ({
  height: '24px',
  fill: theme.primaryColor,
  stroke: theme.primaryColor,
  width: '18px',
}))`
  ${({ theme, onMap }) => (onMap ? '' : `background-color: ${theme.pageBackgroundColor};`)}
`;
