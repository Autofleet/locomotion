import React from 'react';
import { STOP_POINT_TYPES } from '../../../../lib/commonTypes';
import {
  BottomTimeLine,
  Content,
  EtaContent,
  MarkerContiner,
  TextFlexContainer,
  TimeLineContainer,
  TimeLineContent,
  TopTimeLine,
  MainContainer,
} from './styled';
import {
  PickupIconMarker, DropoffIconMarker,
} from '../../marker';

const VerticalTimeLineCard = ({
  sp: { type },
  first = false,
  last = false,
  content,
  underContent,
}) => (
  <>
    <MainContainer>
      <TimeLineContainer>
        <TopTimeLine first={first} />
        <BottomTimeLine last={last}>
          <MarkerContiner first={first} last={last}>
            {type === STOP_POINT_TYPES.STOP_POINT_PICKUP ? <PickupIconMarker /> : undefined}
            {type === STOP_POINT_TYPES.STOP_POINT_DROPOFF ? <DropoffIconMarker /> : undefined}
          </MarkerContiner>
        </BottomTimeLine>
      </TimeLineContainer>
      <TextFlexContainer>
        <TimeLineContent last={last}>
          <Content>
            {content}
          </Content>
          <EtaContent>
            {underContent}
          </EtaContent>
        </TimeLineContent>
      </TextFlexContainer>
    </MainContainer>
  </>
);

export default VerticalTimeLineCard;
