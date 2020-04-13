import React from 'react';
import styled from 'styled-components';

import I18n from '../../../I18n';
import {
  MarkerToolTip,
  MarkerToolTipText,
  StationDot,
  MarkerContainer,
} from './styled';

const AndroidMarkerContainer = styled(MarkerContainer)`
  justify-content: space-between;
`

const AndroidMarkerToolTip = styled(MarkerToolTip)`
  margin-bottom: 5px;
`



export default  ({ type }) => (
    <AndroidMarkerContainer>
      {type
        ? (
          <AndroidMarkerToolTip type={type}>
            <MarkerToolTipText>{I18n.t(`home.map.markers.${type}`)}</MarkerToolTipText>
          </AndroidMarkerToolTip>
        ) : null}
      <StationDot type={type} />
    </AndroidMarkerContainer>
  );

