import React, { useContext } from 'react';
import { RidePageContext } from '../../context/newRideContext';
import SvgIcon from '../SvgIcon';
import backArrow from '../../assets/arrow-back.svg';
import editIcon from '../../assets/edit-icon.svg';
import { Container, StreetAddress } from './styled';

const ICON_SIZE = 15;
const StopPointsViewer = ({ goBackToAddressSelector }) => {
  const { requestStopPoints } = useContext(RidePageContext);
  const firstSp = requestStopPoints[0];
  const lastSp = requestStopPoints[requestStopPoints.length - 1];
  return (
    <Container onPress={goBackToAddressSelector}>
      <StreetAddress numberOfLines={1}>
        {firstSp.streetAddress}
      </StreetAddress>
      <SvgIcon
        Svg={backArrow}
        width={ICON_SIZE}
        height={ICON_SIZE}
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
