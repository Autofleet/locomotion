import { Platform } from 'react-native';
import styled from 'styled-components';
import { commonInputStyle } from '../../assets/style-settings';
import TextInput from '../TextInput';

const isIos = Platform.OS === 'ios';

export const PrefixView = styled.View`
  ${commonInputStyle}
  ${isIos ? 'padding-top: 15px;' : ''}
  ${isIos ? '' : 'padding-right: 5px;'}
`;

export const StyledInput = styled(TextInput)`
  border-bottom-color: #e2e2e2;
`;