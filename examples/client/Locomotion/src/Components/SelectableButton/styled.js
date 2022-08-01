import styled from 'styled-components';
import Button from '../Button';


const colors = theme => ({
  text: theme.primaryButtonTextColor,
  selected: {
    background: theme.primaryColor,
    text: theme.primaryButtonTextColor,
  },
});

export const SubmitButtonText = styled.Text`
  font-size: 16px;
  text-align: center;
  width: 100%;
  line-height: 20px;
  ${({ theme, selected }) => `color: ${selected ? theme.primaryColor : theme.textColor}`};
  ${({ selected }) => selected && 'font-weight: 700'};
`;

export const StyledButton = styled(Button)`
  ${({
    theme,
  }) => `
  flex: 1;
  padding: 5px;
  height:  50px;
`}
`;

export const ButtonTextContainer = styled.View`
  justify-content: space-between;
  flex: 1;
  align-items: center;
  flex-direction: row;
  background-color: #f1f2f6;
  border-radius: 8px;
  border-color: ${({ theme, selected }) => (selected ? theme.primaryColor : 'transparent')};
  border-width: 2px;
`;
