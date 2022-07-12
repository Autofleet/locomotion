import moment from 'moment';
import getSymbolFromCurrency from 'currency-symbol-map';
import React, { useContext } from 'react';
import SvgIcon from '../../../../../../Components/SvgIcon';
import i18n from '../../../../../../I18n';
import Seat from '../../../../../../assets/seat.svg';
import { getCurrencySymbol, TAG_OPTIONS } from '../../../../../../context/newRideContext/utils';
import { Context as ThemeContext } from '../../../../../../context/theme';
import {
  Circle, AvailableSeats,
  Capacity, CardContainer,
  CarIcon, Eta,
  Row, Price,
  ServiceDetails, TimeDetails,
  Title, Description,
  CarContainer, TitleContainer,
} from './styled';
import Tag from '../../../../../../Components/Tag';
import { RidePageContext } from '../../../../../../context/newRideContext';
import { AvailabilityContext } from '../../../../../../context/availability';

const ServiceCard = ({ service }) => {
  const theme = useContext(ThemeContext);
  const { setChosenService, chosenService, serviceEstimations } = useContext(RidePageContext);
  const unavailable = !service.eta;
  const unavailableText = i18n.t('rideDetails.unavailable');
  const serviceDisplayPrice = `${getCurrencySymbol(service.currency)}${service.price}`;
  const tagStyles = {
    [TAG_OPTIONS.FASTEST]: {
      container: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.primaryColor,
        backgroundColor: theme.primaryColor,
      },
      textColor: theme.primaryButtonTextColor,
    },
    [TAG_OPTIONS.CHEAPEST]: {
      container: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.primaryColor,
      },
      textColor: theme.primaryColor,
    },
  };

  const getEta = () => {
    const minutesUntilPickup = moment(service.eta).diff(moment(), 'minutes');
    return minutesUntilPickup < 1
      ? i18n.t('general.now')
      : i18n.t('rideDetails.toolTipEta', { minutes: minutesUntilPickup });
  };

  return (
    <CardContainer
      theme={theme}
      selected={chosenService && chosenService.id === service.id}
      noBackground
      disabled={unavailable}
      onPress={() => setChosenService(service)}
    >
      <CarContainer unavailable={unavailable}>
        <CarIcon
          resizeMode="contain"
          source={{ uri: service.iconUrl }}
        />
      </CarContainer>
      <ServiceDetails unavailable={unavailable}>
        <Row>
          <TitleContainer>
            <Title>
              {service.name}
            </Title>
            {serviceEstimations.filter(s => s.price).length > 1 && service.tag && (
            <Tag
              key={service.tag}
              containerStyles={tagStyles[service.tag].container}
              text={service.tag}
              textColor={tagStyles[service.tag].textColor}
            />
            )
            }
          </TitleContainer>
          <Price>
            {service.price ? serviceDisplayPrice : unavailableText}
          </Price>
        </Row>
        {!unavailable && (
        <Row>
          <TimeDetails>
            <Eta>
              {moment(service.eta).format('HH:mm')}
            </Eta>
            <Circle />
            <Eta>
              {getEta()}
            </Eta>
          </TimeDetails>
          <Capacity>
            <AvailableSeats>
              {service.availableSeats}
            </AvailableSeats>
            <SvgIcon Svg={Seat} width={15} height={15} />
          </Capacity>
        </Row>
        )}
        {service.description && (
        <Row>
          <Description>
            {service.description}
          </Description>
        </Row>
        )}
      </ServiceDetails>
    </CardContainer>
  );
};

export default ServiceCard;
