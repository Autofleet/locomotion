import React from 'react';
import {
  MarkerContainer, StyledIcon, IconContainer, Contrainer,
} from './styled';

function VirtualStationComponent({ type = 'default', isActive = false, style = {} }) {
  return (
    <Contrainer style={style}>
      <MarkerContainer isActive={isActive}>
        <IconContainer>
          <StyledIcon type={type} isActive={isActive} />
        </IconContainer>
      </MarkerContainer>
    </Contrainer>
  );
}

export default VirtualStationComponent;
