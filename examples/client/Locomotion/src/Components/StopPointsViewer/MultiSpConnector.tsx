import React from 'react';
import styled from 'styled-components';
import { Text, View } from 'react-native';
import SvgIcon from '../SvgIcon';
import connectorIcon from '../../assets/connector.svg';

const ICON_SIZE = 12;

const MultiSpConnectorContainer = styled(View)`
  flex-direction: row;
`;

const ConnectorText = styled(Text)`
  margin-right: 2px;
  margin-left: 2px;
`;

const ThreeDotsContainer = styled(View)`
  margin-top: 4px;
`;

interface MultiSpConnectorProps {
  amountOfStops: number;
}

const ConnectorThreeDots = props => (
  <ThreeDotsContainer {...props}>
    <SvgIcon
      Svg={connectorIcon}
      width={ICON_SIZE}
      height={ICON_SIZE}
    />
  </ThreeDotsContainer>
);

const MultiSpConnector = ({ amountOfStops }: MultiSpConnectorProps) => (
  <MultiSpConnectorContainer>
    <ConnectorThreeDots />
    <ConnectorText>
      {`+${amountOfStops}`}
    </ConnectorText>
    <ConnectorThreeDots marginRight={2} />
  </MultiSpConnectorContainer>
);

export default MultiSpConnector;
