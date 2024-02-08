import styled from 'styled-components/native';

interface TabStyled {
    isSelected: boolean;
}

export const SELECTED_COLOR = '#212229';
export const UNSELECTED_COLOR = '#666975';

export const Container = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-color: rgba(125, 139, 172, 0.32)
  border-bottom-width: 1px;
  border-bottom-color: #7D8BAC52;
  margin-bottom: 16px;
  padding-left: 8px;
  padding-right: 8px;
  overflow: hidden;
`;

export const Tab = styled.TouchableOpacity`
  height: 40px;
  justify-content: center;
  align-items: center;
  flex: 1 0 0;
  text-align: center; 
  ${({ isSelected }: TabStyled) => isSelected && `border-bottom-width: 2px; border-bottom-color: ${SELECTED_COLOR};`}
  margin-left: 8px;
  margin-right: 8px;
  overflow: hidden;
`;
export const TabInner = styled.View`
display: flex;
flex-direction: row;
height: 32px;
padding: 4px;
justify-content: center;
align-items: center;
color: ${({ isSelected }: TabStyled) => (isSelected ? SELECTED_COLOR : UNSELECTED_COLOR)};
font-family: Inter;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 24px;
`;
export const TextContainer = styled.Text`
color: #666975;
color: ${({ isSelected }: TabStyled) => (isSelected ? SELECTED_COLOR : UNSELECTED_COLOR)};
font-family: Inter;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 24px;
padding-left: 4px;
`;
