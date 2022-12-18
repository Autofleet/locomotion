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
import LinkText from '../../Components/LinkText';
import stationIcon from '../../assets/map/markers/stations/arrow.svg';


const VirtualStationTooltip = ({ station, onPress }) => (
  <Tooltip>
    <StationDetails>
      <Row>
        <StationName>{station.label}</StationName>
        {/* {station.distance ? <DistanceText>{`${station.distance}m`}</DistanceText> : null} */}
      </Row>
      <Row>
        <AddressText>{station.address}</AddressText>
      </Row>
    </StationDetails>
    {/*     <BottomActions>
      <LinkText
        iconSide="right"
        icon={stationIcon}
        onPress={() => onPress(station)}
      >
        {i18n.t('virtualStations.tooltip.setDropoff')}

      </LinkText>
    </BottomActions> */}
  </Tooltip>
);

export default VirtualStationTooltip;
