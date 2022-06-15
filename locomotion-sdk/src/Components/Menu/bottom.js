import React from 'react';
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
  font-size: 14px;
  padding: 5px;
  ${FONT_SIZES.SMALL}
  ${FONT_WEIGHTS.LIGHT}
`;

export const BottomTextBold = styled.Text`
  font-size: 16px;
  ${FONT_SIZES.SMALL}
  ${FONT_WEIGHTS.BOLD}
`;

const appVersion = getVersion();

export default () => (
  <BottomContainer>
    <BottomFlexContainer>
      <BottomText>
        powered by
        <BottomTextBold> Autofleet</BottomTextBold>
      </BottomText>
      <BottomText>
        {`v. ${appVersion}`}
      </BottomText>
    </BottomFlexContainer>
  </BottomContainer>
);
