import React, { useContext } from 'react';
import { RidePageContext } from '../../context/newRideContext';
import SvgIcon from '../SvgIcon';
import backArrow from '../../assets/arrow-back.svg';
import editIcon from '../../assets/edit-icon.svg';
import { Container, StreetAddress } from './styled';

const StopPointsViewer = ({ goBackToAddressSelector }) => {
  const { requestStopPoints } = useContext(RidePageContext);
  const firstSp = requestStopPoints[0];
  const lastSp = requestStopPoints[requestStopPoints.length - 1];
  return (
    <Container onPress={goBackToAddressSelector}>
      <StreetAddress numberOfLines={1}>
        {firstSp.streetAddress}
      </StreetAddress>
      <SvgIcon Svg={backArrow} width={15} height={15} />
      <StreetAddress numberOfLines={1}>
        {lastSp.streetAddress}
      </StreetAddress>
      <SvgIcon Svg={editIcon} width={15} height={15} />
    </Container>
  );
};

export default StopPointsViewer;
