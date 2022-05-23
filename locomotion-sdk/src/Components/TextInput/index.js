import styled from 'styled-components';
import { commonInputStyleWithTheme } from '../../assets/style-settings';

export default styled.TextInput.attrs(({ autoCapitalize, theme }) => ({
  autoCapitalize: autoCapitalize || 'none',
  autoCompleteType: 'off',
  autoCorrect: false,
  placeholderTextColor: theme.isDarkMode ? 'gray' : undefined,
}))`
  width: ${({ width }) => (width || '100%')};
  border-bottom-width: 1px;
  margin: 15px auto;
  ${({ theme }) => `
    border-bottom-color: ${theme.isDarkMode ? '#fff' : '#e2e2e2'};
    color: ${theme.textColor};
    ${commonInputStyleWithTheme(theme)}
  `}
`;
