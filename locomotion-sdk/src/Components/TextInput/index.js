import styled from 'styled-components';
import { commonInputStyle } from '../../assets/style-settings';


export default styled.TextInput.attrs(({ autoCapitalize }) => ({
  autoCapitalize: autoCapitalize || 'none', autoCompleteType: 'off', autoCorrect: false,
}))`
  ${commonInputStyle}
  width: ${({ width }) => (width || '100%')};
  border-bottom-color: #e2e2e2;
  border-bottom-width: 1px;
  margin: 15px auto;
`;
