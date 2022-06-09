import styled from 'styled-components';

export const MapButtonsContainer = styled.View`
  margin: 8px;
  flex-direction: row-reverse;
`;

export const DrawerContainer = styled.View`
  flex-direction: column;
  position: absolute;
  bottom: 0;
  width: 100%;
`;

export const DrawerContentContainer = styled.SafeAreaView`
  flex-direction: column;
  background-color: ${({ theme }) => theme.pageBackgroundColor};
`;
