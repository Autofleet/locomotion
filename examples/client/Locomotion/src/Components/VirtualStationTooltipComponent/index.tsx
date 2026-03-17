import React from 'react';
import i18n from '../../I18n';
import {
  Tooltip,
  StationDetails,
  Row,
  StationName,
  DistanceText,
  AddressText,
  BottomActions,
} from './styled';
import { Station } from '../../context/virtualStationsContext';

interface VirtualStationTooltipProps {
  station: Station;
}

const VirtualStationTooltip = ({ station }: VirtualStationTooltipProps) => (
  <Tooltip>
    <StationDetails>
      <Row>
        <StationName>{station.label}</StationName>
      </Row>
      <Row>
        <AddressText>{station.address}</AddressText>
      </Row>
    </StationDetails>
  </Tooltip>
);

export default VirtualStationTooltip;
