import styled from 'styled-components';
import Button from '../Button';

const colors = theme => ({
  confirm: {
    primary: {
      background: theme.primaryColor,
      text: theme.primaryButtonTextColor,
    },
    hollow: {
      background: theme.pageBackgroundColor,
      text: theme.textColor,
      border: theme.primaryColor,
    },
  },
  cancel: {
    primary: {
      background: '#f03a5f',
      text: '#ffffff',
    },
    hollow: {
      background: '#ffffff',
      border: '#f03a5f',
      text: '#f03a5f',
    },
  },
});

export const SubmitButtonText = styled.Text`
  font-size: 14px;
  text-align: center;
  width: 100%;
  ${({
    useCancelTextButton, theme, hollow, type = 'confirm',
  }) => (useCancelTextButton ? `
      color: ${colors(theme).confirm.hollow.text};
  ` : `
      color: ${colors(theme)[type][hollow ? 'hollow' : 'primary'].text}
  `)}


  ${({ disabled, theme }) => (disabled ? `
      color: ${theme.primaryButtonTextColor};
  ` : '')}
`;

export const StyledButton = styled(Button)`
  ${({
    disabled, theme, hollow, type = 'confirm', useCancelTextButton, width, height, marginTop,
  }) => `
      flex-direction: row;
      border-radius: 8px;
      width: ${width || '100%'};
      height: ${height || '50px'};

      background-color: ${colors(theme)[type][hollow ? 'hollow' : 'primary'].background};
      ${marginTop ? `margin-top: ${marginTop};` : ''}
      ${disabled ? `
        background-color: ${theme.disabledColor};
      ` : `
        ${((hollow) ? `border: 2px solid ${colors(theme)[type].hollow.border};` : '')}
        ${(useCancelTextButton) ? `
          border: 2px solid transparent;
        ` : ''}
      `}
    `}
`;

export const ButtonTextContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
`;
