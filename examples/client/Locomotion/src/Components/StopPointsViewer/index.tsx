import React, { useContext } from 'react';
import { STOP_POINT_TYPES } from '../../lib/commonTypes';
import { RidePageContext } from '../../context/newRideContext';
import SvgIcon from '../SvgIcon';
import backArrow from '../../assets/arrow-back.svg';
import editIcon from '../../assets/edit-icon.svg';
import { Container, StreetAddress, StreetAddressContainer } from './styled';

const ICON_SIZE = 15;

interface StopPointsViewerProps {
  goBackToAddressSelector: (selected: string | null) => void
}

const StopPointsViewer = ({ goBackToAddressSelector }: StopPointsViewerProps) => {
  const { requestStopPoints } = useContext(RidePageContext);
  const firstSp: any = requestStopPoints[0];
  const lastSp: any = requestStopPoints[requestStopPoints.length - 1];
  return (
    <Container>
      <StreetAddressContainer
        onPress={() => goBackToAddressSelector(STOP_POINT_TYPES.STOP_POINT_PICKUP)}
      >
        <StreetAddress>
          {firstSp?.streetAddress}
        </StreetAddress>
      </StreetAddressContainer>
      <SvgIcon
        Svg={backArrow}
        width={ICON_SIZE}
        height={ICON_SIZE}
        style={{ transform: [{ rotate: '180deg' }] }}
      />
      <StreetAddressContainer
        onPress={() => goBackToAddressSelector(STOP_POINT_TYPES.STOP_POINT_DROPOFF)}
      >
        <StreetAddress>
          {lastSp.streetAddress}
        </StreetAddress>
      </StreetAddressContainer>
      <SvgIcon
        Svg={editIcon}
        width={ICON_SIZE}
        height={ICON_SIZE}
      />
    </Container>
  );
};

export default StopPointsViewer;
