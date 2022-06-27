import styled from 'styled-components';
import { isAndroid } from '../../../services/isAndroid';

export const FilterView = styled.View`
  border-radius: 55px;
  display: flex;
  padding: 10px 20px;
  margin-bottom: 3px;
  border: 1px;
  margin-right: 10px;
  flex-direction: row;
  shadow-opacity: 0.15;
  shadow-radius: 2px;
  shadow-color: #1c1c1c;
  shadow-offset: 0px 2px;

  ${({ active, theme }) => (active ? `
    border-color: ${theme.primaryColor};
    background-color: ${theme.primaryColor};
  ` : `
    border-color: ${theme.disabledColor};
    background-color: ${theme.pageBackgroundColor};
  `)};

`;

export const FilterText = styled.Text`
  color: ${({ active }) => (active ? '#fff' : '#333333')};
  font-size: 16px;
`;

export const FilterBarContainer = styled.ScrollView.attrs(props => ({
  accessibilityLabel: props.testID,
  testID: props.testID,
  horizontal: true,
  contentContainerStyle: { paddingHorizontal: 20 },
}))`
    width: 100%;
    padding-bottom: 5px;
    flex-direction: row;
    background-color: #ffffff00;
`;

export const FilterTouchableOpacity = styled.TouchableOpacity``;
