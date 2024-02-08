import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { STOP_POINT_TYPES } from '../../lib/commonTypes';
import { RidePageContext } from '../../context/newRideContext';
import SvgIcon from '../SvgIcon';
import backArrow from '../../assets/arrow-back.svg';
import MultiSpConnector from './MultiSpConnector';
import editIcon from '../../assets/edit-icon.svg';
import {
  Container, StreetAddress, StreetAddressContainer,
} from './styled';

const ICON_SIZE = 15;

interface StopPointsViewerProps {
  goBackToAddressSelector: (selected: number | null) => void
}

const StopPointsViewer = ({ goBackToAddressSelector }: StopPointsViewerProps) => {
  const { requestStopPoints } = useContext(RidePageContext);
  const firstSp: any = requestStopPoints[0];
  const lastSp: any = requestStopPoints[requestStopPoints.length - 1];
  const renderSpConnector = () => {
    const amountOfStops = requestStopPoints.length - 2;
    const isMultiSpMode = amountOfStops > 0;
    if (isMultiSpMode) {
      return (
        <MultiSpConnector
          amountOfStops={amountOfStops}
        />
      );
    }
    return (
      <SvgIcon
        Svg={backArrow}
        width={ICON_SIZE}
        height={ICON_SIZE}
        style={{ transform: [{ rotate: '180deg' }] }}
      />
    );
  };
  return (
    requestStopPoints.filter(sp => !!sp.lat).length > 1 ? (
      <Container>
        <StreetAddressContainer
          testID="estimationsPickupEdit"
          onPress={() => goBackToAddressSelector(0)}
        >
          <StreetAddress
            testID={firstSp?.streetAddress}
          >
            {firstSp?.streetAddress}
          </StreetAddress>
        </StreetAddressContainer>
        {renderSpConnector()}
        <StreetAddressContainer
          testID="estimationsDropOffEdit"
          onPress={() => goBackToAddressSelector(requestStopPoints.length - 1)}
        >
          <StreetAddress
            testID={lastSp?.streetAddress}
          >
            {lastSp?.streetAddress}
          </StreetAddress>
        </StreetAddressContainer>
        <TouchableOpacity
          testID="editIcon"
          onPress={() => goBackToAddressSelector(requestStopPoints.length - 1)}
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
