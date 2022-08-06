import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { STOP_POINT_TYPES } from '../../lib/commonTypes';
import { RidePageContext } from '../../context/newRideContext';
import SvgIcon from '../SvgIcon';
import backArrow from '../../assets/arrow-back.svg';
import editIcon from '../../assets/edit-icon.svg';
import { Container, StreetAddress, StreetAddressContainer } from './styled';

const ICON_SIZE = 15;

interface StopPointsViewerProps {
  goBackToAddressSelector: (selected: number | null) => void
}

const StopPointsViewer = ({ goBackToAddressSelector }: StopPointsViewerProps) => {
  const { requestStopPoints } = useContext(RidePageContext);
  const firstSp: any = requestStopPoints[0];
  const lastSp: any = requestStopPoints[requestStopPoints.length - 1];
  return (
    requestStopPoints.filter(sp => !!sp.lat).length > 1 ? (
      <Container>
        <StreetAddressContainer
          testID="estimationsPickupEdit"
          onPress={() => goBackToAddressSelector(0)}
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
          testID="estimationsDropOffEdit"
          onPress={() => goBackToAddressSelector(1)}
        >
          <StreetAddress>
            {lastSp?.streetAddress}
          </StreetAddress>
        </StreetAddressContainer>
        <TouchableOpacity
          onPress={() => goBackToAddressSelector(1)}
        >
          <SvgIcon
            Svg={editIcon}
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
        </TouchableOpacity>
      </Container>
    ) : null);
};

export default StopPointsViewer;
