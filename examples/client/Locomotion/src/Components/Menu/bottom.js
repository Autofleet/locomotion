import React from 'react';
import Config from 'react-native-config';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';
import { getVersion } from '../../services/device';

export const BottomContainer = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  align-items: center;
`;

export const BottomFlexContainer = styled.View`
  width: 100%;
  padding: 10px 10px 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`;

export const BottomText = styled.Text`
  padding: 5px;
  color: ${({ theme }) => theme.disabledColor};
  ${FONT_SIZES.SMALL}
  ${FONT_WEIGHTS.LIGHT}
`;

export const BottomTextBold = styled.Text`
  ${FONT_SIZES.SMALL}
  ${FONT_WEIGHTS.MEDIUM}
`;

const appVersion = getVersion();

const shouldHideAutofleet = Config.HIDE_AUTOFLEET && Config.HIDE_AUTOFLEET === 'true';

export default () => (
  !shouldHideAutofleet
  && (
  <BottomContainer>
    <BottomFlexContainer>
      <BottomText numberOfLines={1}>
        powered by
        <BottomTextBold> Autofleet </BottomTextBold>
        {`v. ${appVersion}`}
      </BottomText>
    </BottomFlexContainer>
  </BottomContainer>
  )
);
