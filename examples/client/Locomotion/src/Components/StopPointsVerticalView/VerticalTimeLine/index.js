import React from 'react';
import { STOP_POINT_TYPES } from '../../../lib/commonTypes';
import {
  Content,
  EtaContent,
  IconContainer,
  Line,
  MainContainer,
} from './styled';
import {
  PickupIconMarker, DropoffIconMarker,
} from '../../../pages/RideHistory/marker';

const VerticalTimeLineCard = ({
  sp: { type },
  first = false,
  last = false,
  content,
  underContent,
}) => (
  <MainContainer>
    <IconContainer>
      {type === STOP_POINT_TYPES.STOP_POINT_PICKUP ? <PickupIconMarker /> : <DropoffIconMarker />}
    </IconContainer>
    <Content>
      {content}
    </Content>
    <EtaContent>
      {underContent}
    </EtaContent>
  </MainContainer>
);

export default VerticalTimeLineCard;
