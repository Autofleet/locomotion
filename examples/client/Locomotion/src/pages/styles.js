import styled from 'styled-components';
import SafeView from '../Components/SafeView';

export const PageContainer = styled(SafeView)`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.pageBackgroundColor};
`;

export const ContentContainer = styled.View`
padding: 35px 30px;
`;
