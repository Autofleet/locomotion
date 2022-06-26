import React from 'react';
import styled from 'styled-components';

import { FONT_SIZES, FONT_WEIGHTS } from '../context/theme';
import i18n from '../I18n';
import { linkColor } from '../assets/style-settings';
import Button from '../Components/Button';

const borderRadius = 2;

export const ModalContainer = styled.View`
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: ${borderRadius};
  border-color: rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const Content = styled.View`
  padding: 22px;
`;

export const Title = styled.Text`
  ${FONT_SIZES.H2}
  ${FONT_WEIGHTS.SEMI_BOLD}
`;

export const SubTitle = styled.Text`
  ${FONT_SIZES.LARGE}
  ${FONT_WEIGHTS.LIGHT}
`;

const FooterButtonText = styled.Text`
  color: ${linkColor};
`;

export const FooterButton = styled(({ children, ...props }) => (
  <Button {...props}>
    <FooterButtonText>{children || i18n.t('popups.defaultFooterButton')}</FooterButtonText>
  </Button>
))`
  height: 60px;
  justify-content: center;
  align-items: center;
  border-top-color: #ededed;
  border-top-width: 1;
  width: 100%;
  border-bottom-left-radius: ${borderRadius};
  border-bottom-right-radius: ${borderRadius};
`;
