import styled from 'styled-components';
import { ERROR_COLOR } from '../../services/sharedStyles';
import { commonInputStyle } from '../../assets/style-settings';

const bottomBorderStyles = `
border-bottom-color: #e2e2e2;
border-bottom-width: 1px;
`;

const fullBorderStyles = focused => `
backgroundColor: #f1f2f6;
borderRadius: 8px;
${focused && 'border: 1px solid #333333'};

`;

export default styled.TextInput.attrs(({ autoCapitalize }) => ({
  autoCapitalize: autoCapitalize || 'none', autoCompleteType: 'off', autoCorrect: false,
}))`
  ${commonInputStyle}
  width: ${({ width }) => (width || '100%')};
  ${({ fullBorder, focused }) => (fullBorder ? fullBorderStyles(focused) : bottomBorderStyles)}
  margin: 15px auto;
  border-color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};
  color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};

`;
