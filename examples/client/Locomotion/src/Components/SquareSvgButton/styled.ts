import { View } from 'react-native';
import styled from 'styled-components';
import Button from '../Button';

export const ButtonContainer = styled(Button)`
  elevation: 6;
  background-color: ${({ theme }) => theme.pageBackgroundColor};
  border-radius: 8px;
  width: 40px;
  height: 40px;
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const ButtonHeaderView = styled(Button)`
  background-color: unset;
`;
