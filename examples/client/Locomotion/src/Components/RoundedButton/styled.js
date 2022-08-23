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
      text: '#333333',
    },
  },
});

export const SubmitButtonText = styled.Text`
  font-size: 14px;
  text-align: center;
  width: 100%;
  max-width: 100%;
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
    disabled, theme, hollow, type = 'confirm', useCancelTextButton, width, height, marginTop, withIcon,
  }) => `
      flex-direction: row;
      border-radius: 8px;
      width: ${width || '100%'};
      height: ${height};
      min-height: ${height || '50px'};
      ${withIcon
    ? `justify-content: flex-start;
      align-items: center`
    : ''}

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
  ${({ withIcon }) => (!withIcon ? 'flex: 1' : '')}
`;
