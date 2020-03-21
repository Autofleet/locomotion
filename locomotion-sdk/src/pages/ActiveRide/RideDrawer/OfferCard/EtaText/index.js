import React, { Fragment } from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import moment from 'moment';

import i18n from '../../../../../I18n';
import warningMediumIcon from '../../../../../assets/warning_yellow.png';
import warningHighIcon from '../../../../../assets/warning_red.png';

const EtaContainer = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 3px;
`;

const Wrap = styled.View`
    flex: 2;
    flex-direction: row;
    padding-top: 2px;
    padding-right: 3px;
    padding-left: 2px;
`;
const EtaText = styled.Text`
    flex: 1;
    color: #727272;
    margin-start: 22;
    font-size: 12px;
    max-width: 80px;
`;
const EtaWarningText = styled.Text`
    flex: 1;
    color: ${({ red }) => (red ? '#c60d0d' : '#f0c228')};
    font-size: 10px;
    margin-left: 2px;
    font-weight: 500;
`;

const WarningIcon = styled.Image`
  width: 12px;
  height: 12px;
`;

const WarningContainer = styled.View`

`;


export default ({
  eta, etaDrift, pickup, etaMediumThreshold, etaHighThreshold,
}) => {
  const getWarningMessage = () => {
    const etaDiff = moment(eta).diff(moment(), 'minutes');
    let etaThreshold = null;
    if (!pickup) {
      return null;
    }

    if (etaDiff > etaMediumThreshold) {
      etaThreshold = etaMediumThreshold;
    }

    if (etaDiff >= etaHighThreshold) {
      etaThreshold = etaHighThreshold;
    }

    if (!etaThreshold) {
      return null;
    }
    return (
      <Fragment>
        <WarningIcon
          source={etaThreshold === etaHighThreshold ? warningHighIcon : warningMediumIcon}
        />
        <EtaWarningText red={etaThreshold === etaHighThreshold}>
          {i18n.t('home.offerCard.etaNotice', { etaThreshold })}
        </EtaWarningText>
      </Fragment>
    );
  };

  return (
    <EtaContainer>
      <EtaText>
        {`${moment(eta).format('HH:mm')} - ${moment(eta).add(etaDrift, 'minutes').format('HH:mm')}`}
      </EtaText>
      <Wrap>
        {getWarningMessage()}
      </Wrap>
    </EtaContainer>
  );
};
