import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import propsTypes from 'prop-types';
import { View } from 'react-native';
import SvgIcon from '../../../../../../Components/SvgIcon';
import i18n from '../../../../../../I18n';
import Seat from '../../../../../../assets/seat.svg';
import {
  getFormattedPrice,
  TAG_OPTIONS,
} from '../../../../../../context/newRideContext/utils';
import { Context as ThemeContext } from '../../../../../../context/theme';
import {
  Circle,
  AvailableSeats,
  Capacity,
  CardContainer,
  CarIcon,
  Eta,
  Row,
  Price,
  ServiceDetails,
  TimeDetails,
  Title,
  Description,
  CarContainer,
  TitleContainer,
  EstimatedText,
  WrapRow,
  HighEta,
} from './styled';
import Tag from '../../../../../../Components/Tag';
import { RidePageContext } from '../../../../../../context/newRideContext';
import FareBreakdownPopup from '../../../../../../popups/FareBreakdownPopup';
import SettingContext from '../../../../../../context/settings';
import PaymentContext from '../../../../../../context/payments';
import showPriceBasedOnAccount from '../../../../../../services/showPriceBasedOnAccount';

const FARE_POPUP = 'farePopup';

const ServiceCard = ({ service, withBorder, testID }) => {
  const { businessAccountId } = useContext(RidePageContext);
  const theme = useContext(ThemeContext);
  const { setChosenService, chosenService, serviceEstimations, ride } =
    useContext(RidePageContext);
  const { showPrice, loadShowPrice } = SettingContext.useContainer();
  const { getBusinessAccountById } = PaymentContext.useContainer();
  const [popup, setPopup] = useState(null);
  const isFutureRide = ride.scheduledTo;
  const unavailable = !(
    (ride.scheduledTo && service.priceCalculationId) ||
    service.eta ||
    service.isHighEtaAsapRide
  );
  const isSelected = chosenService && chosenService.id === service.id;
  const sharedTagContainerStyles = {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.primaryColor,
    marginRight: 5,
  };
  const tagStyles = {
    [TAG_OPTIONS.FASTEST]: {
      container: {
        ...sharedTagContainerStyles,
        backgroundColor: theme.primaryColor,
      },
      textColor: theme.primaryButtonTextColor,
    },
    [TAG_OPTIONS.CHEAPEST]: {
      container: {
        ...sharedTagContainerStyles,
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

  const etaTimeDetails = () => {
    if (service.isHighEtaAsapRide) {
      return <HighEta theme={theme}>{i18n.t('rideDetails.highEta')}</HighEta>;
    }
    return (
      <TimeDetails>
        <Eta>{moment(service.eta).format('h:mm A')}</Eta>
        <Circle />
        <Eta>{getEta()}</Eta>
      </TimeDetails>
    );
  };

  const getDescription = (forFutureRidesView) => (
    <Description
      style={{ ...(forFutureRidesView && { width: '60%' }) }}
      numberOfLines={2}
    >
      {service.description || ''}
    </Description>
  );

  const getUnavailableText = () => {
    if (unavailable) {
      if (service.outOfTerritory) {
        return i18n.t('rideDetails.outOfTerritory');
      }

      return i18n.t('rideDetails.unavailable');
    }

    return showPrice
      ? getFormattedPrice(service.currency, service.price)
      : null;
  };

  useEffect(() => {
    showPriceBasedOnAccount(
      loadShowPrice,
      getBusinessAccountById,
      businessAccountId
    );
  }, [businessAccountId]);

  return (
    <>
      <CardContainer
        testID={testID}
        theme={theme}
        withBorder={withBorder}
        selected={isSelected}
        activeOpacity={!withBorder ? 1 : 0.5}
        noBackground
        disabled={unavailable}
        onPress={() => {
          if (withBorder) {
            if (isSelected) {
              return setPopup(FARE_POPUP);
            }
            setChosenService(service);
          }
        }}
      >
        <CarContainer unavailable={unavailable}>
          <CarIcon resizeMode='contain' source={{ uri: service.iconUrl }} />
        </CarContainer>
        <ServiceDetails unavailable={unavailable}>
          <WrapRow>
            <Title numberOfLines={2}>{service.name}</Title>
            <TitleContainer>
              {serviceEstimations.filter((s) => s.price).length > 1 &&
              service.tag &&
              !(isFutureRide && service.tag === TAG_OPTIONS.FASTEST) ? (
                <Tag
                  key={service.tag}
                  containerStyles={tagStyles[service.tag].container}
                  text={service.tag}
                  textColor={tagStyles[service.tag].textColor}
                />
              ) : (
                <View />
              )}
              <Price>{getUnavailableText()}</Price>
            </TitleContainer>
          </WrapRow>
          {!unavailable && (
            <WrapRow>
              {!isFutureRide ? etaTimeDetails() : getDescription(isFutureRide)}

              {service.isPriceEstimated && showPrice ? (
                <EstimatedText>
                  {i18n.t('rideDetails.estimatedFare')}
                </EstimatedText>
              ) : (
                <Capacity>
                  <AvailableSeats>{service.availableSeats}</AvailableSeats>
                  <SvgIcon Svg={Seat} width={15} height={15} />
                </Capacity>
              )}
            </WrapRow>
          )}
          {!isFutureRide && (
            <Row>
              {getDescription()}
              {service.isPriceEstimated && showPrice ? (
                <Capacity>
                  <AvailableSeats>{service.availableSeats}</AvailableSeats>
                  <SvgIcon Svg={Seat} width={15} height={15} />
                </Capacity>
              ) : null}
            </Row>
          )}
        </ServiceDetails>
      </CardContainer>
      {popup === FARE_POPUP && (
        <FareBreakdownPopup
          isVisible={popup === FARE_POPUP}
          service={service}
          onClose={() => setPopup('')}
        />
      )}
    </>
  );
};

ServiceCard.defaultProps = {
  service: {},
  withBorder: false,
};

ServiceCard.propTypes = {
  service: propsTypes.any,
  withBorder: propsTypes.bool,
};

export default ServiceCard;
