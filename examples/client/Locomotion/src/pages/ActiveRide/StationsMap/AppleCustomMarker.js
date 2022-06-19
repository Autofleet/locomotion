import React from 'react';
import styled from 'styled-components';

import I18n from '../../../I18n';
import {
  MarkerToolTip,
  MarkerToolTipText,
  StationDot,
  MarkerContainer,
} from './styled';

const IosMarkerContainer = styled(MarkerContainer)`
    flex-direction: column-reverse;
`;

const IosMarkerToolTip = styled(MarkerToolTip)`
    position: absolute;
    top: -24px;
`;

export default ({ type }) => (
  <IosMarkerContainer>
    {type
      ? (
        <IosMarkerToolTip type={type}>
          <MarkerToolTipText>{I18n.t(`home.map.markers.${type}`)}</MarkerToolTipText>
        </IosMarkerToolTip>
      ) : null}
    <StationDot type={type} />
  </IosMarkerContainer>
);
