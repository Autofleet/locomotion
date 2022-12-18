import React from 'react';
import {
  MarkerContainer, StyledIcon, IconContainer, Contrainer,
} from './styled';

const VirtualStationComponent = ({ type = 'default', isActive = false, style }) => (
  <Contrainer style={style}>
    <MarkerContainer isActive={isActive}>
      <IconContainer>
        <StyledIcon type={type} isActive={isActive} />
      </IconContainer>
    </MarkerContainer>
  </Contrainer>
);

export default VirtualStationComponent;
