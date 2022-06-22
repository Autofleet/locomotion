import React, { useContext } from 'react';
import { RidePageContext } from '../../context/newRideContext';
import SvgIcon from '../SvgIcon';
import backArrow from '../../assets/arrow-back.svg';
import editIcon from '../../assets/edit-icon.svg';
import { Container, StreetAddress } from './styled';

const ICON_SIZE = 15;

interface StopPointsViewerProps {
  goBackToAddressSelector: () => void
}

const StopPointsViewer = ({ goBackToAddressSelector }: StopPointsViewerProps) => {
  const { requestStopPoints } = useContext(RidePageContext);
  const firstSp: any = requestStopPoints[0];
  const lastSp: any = requestStopPoints[requestStopPoints.length - 1];
  return (
    <Container onPress={goBackToAddressSelector}>
      <StreetAddress numberOfLines={1}>
        {firstSp.streetAddress}
      </StreetAddress>
      <SvgIcon
        Svg={backArrow}
        width={ICON_SIZE}
        height={ICON_SIZE}
        style={{ transform: [{ rotate: '180deg' }] }}
      />
      <StreetAddress numberOfLines={1}>
        {lastSp.streetAddress}
      </StreetAddress>
      <SvgIcon
        Svg={editIcon}
        width={ICON_SIZE}
        height={ICON_SIZE}
      />
    </Container>
  );
};

export default StopPointsViewer;
