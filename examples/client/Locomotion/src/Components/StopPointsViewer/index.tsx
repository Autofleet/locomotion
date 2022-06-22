import React, { useContext } from 'react';
import { RidePageContext } from '../../context/newRideContext';
import SvgIcon from '../SvgIcon';
import backArrow from '../../assets/arrow-back.svg';
import editIcon from '../../assets/edit-icon.svg';
import { Container, StreetAddress } from './styled';

const StopPointsViewer = () => {
  const { requestStopPoints } = useContext(RidePageContext);
  console.log(requestStopPoints);
  const firstSp = requestStopPoints[0];
  const lastSp = requestStopPoints[requestStopPoints.length - 1];
  return (
        <Container>
            <StreetAddress>
                {firstSp.streetAddress}
            </StreetAddress>
            <SvgIcon Svg={backArrow} width={25} height={25}/>
            <StreetAddress>
                {lastSp.streetAddress}
            </StreetAddress>
            <SvgIcon Svg={editIcon} width={25} height={25} />
        </Container>
  );
};

export default StopPointsViewer;
