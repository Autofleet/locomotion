import styled from 'styled-components';
import Button from '../Button';

const COLORS = {
  confirm: {
    primary: {
      background: '#1e273d',
      text: '#ffffff',
    },
    hollow: {
      background: '#ffffff',
      border: '#b5b5b5',
      text: '#b5b5b5',
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
};
export const SubmitButtonText = styled.Text`
  color: ${({ type }) => (type ? COLORS[type].primary.text : '#ffffff')};
  font-size: 14px;
  text-align: center;
  ${({ hollow, type, useCancelTextButton }) => (hollow || useCancelTextButton) && `
    color: ${type ? (!useCancelTextButton ? COLORS[type].hollow.text : COLORS.confirm.primary.background) : '#b5b5b5'};
  `}
  width: 100%;
`;
export const StyledTouchableOpacity = styled(Button)`
  width: ${({ width }) => (width || '100%')};
  border-radius: 24px;
  background-color: ${({ type }) => (type ? COLORS[type].primary.background : '#1e273d')};
  height: ${({ height }) => (height || '40px')};

  ${({ marginTop }) => marginTop && `
    margin-top: ${marginTop};
  `}

  ${({ hollow, type, useCancelTextButton }) => (hollow || useCancelTextButton) && `
    background-color: ${type ? COLORS[type].hollow.background : '#ffffff'};
    border: 2px solid ${type ? (!useCancelTextButton ? COLORS[type].hollow.border : 'transparent') : '#b5b5b5'};
  `}

  flex-direction: row;

  ${({ disabled }) => disabled && `
    opacity: 0.7;
  `}
`;
export const ButtonTextContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
`;
