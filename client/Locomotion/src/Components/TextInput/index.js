import styled from 'styled-components';
import { commonInputStyle } from '../../assets/style-settings';


export default styled.TextInput`
  ${commonInputStyle}
  width: ${({ width }) => (width || '100%')};
  border-bottom-color: #7c8799;
  border-bottom-width: 1px;
`;
