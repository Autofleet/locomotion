import React from 'react';
import styled from 'styled-components';

import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';
import i18n from '../../I18n';
import { linkColor } from '../../assets/style-settings';
import Button from '../../Components/Button';

const borderRadius = 8;

export const ModalContainer = styled.View`
  background-color: white;
  justify-content: center;
  align-items: center;
  align-self: center;
  border-radius: ${borderRadius};
  border-color: rgba(0, 0, 0, 0.1);
  overflow: hidden;
  flex-direction: column;
  width: 250px;
  height: 200px
`;

export const Content = styled.View`
  padding: 22px;
`;

export const Title = styled.Text`
  ${FONT_SIZES.H2}
  ${FONT_WEIGHTS.SEMI_BOLD}
`;
