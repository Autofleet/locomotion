import { View } from 'react-native';
import styled from 'styled-components';

import Button from '../../Components/RoundedButton';

export const ModalContainer = styled(View)`
  flex-direction: column;
  background-color: white;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  padding: 22px;
  padding-bottom: 34px;
`;

export const ConfirmButton = styled(Button)`
  margin-bottom: 15px;
`;

export const CancelButton = styled(Button)`
`;
