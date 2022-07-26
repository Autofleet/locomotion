import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
import CardsTitle from '../CardsTitle';
import i18n from '../../I18n';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

const ServiceName = styled(Text)`
    ${FONT_SIZES.H3};
    ${FONT_WEIGHTS.MEDIUM};
`;

const ServiceTypeDetails = ({
  serviceType,
}: {
    serviceType: any,
}) => (serviceType ? (
  <>
    <CardsTitle noPaddingLeft title={i18n.t('ride.serviceType')} />
    <ServiceName>{serviceType.name}</ServiceName>
  </>
) : null
);


export default ServiceTypeDetails;
