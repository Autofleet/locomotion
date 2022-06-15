import SvgIcon from "../../../../../../Components/SvgIcon";
import i18n from "../../../../../../I18n";
import moment from "moment";
import Seat from '../../../../../../assets/seat.svg'
import React, { useContext } from "react";
import { ServiceDetailsInterface, TAG_OPTIONS } from "../../../../../../context/rideServicesContext/mockServiceEstimations";
import { Context as ThemeContext } from '../../../../../../context/theme';
import { Circle, AvailableSeats, 
    Capacity, CardContainer, 
    CarIcon, Eta, 
    Row, Price, 
    ServiceDetails, TimeDetails, 
    Title, Description, 
    TopRow, CarContainer } from "./styled";
import Tag from "../../../../../../Components/Tag";

const ServiceCard = ({ selected, service }: { selected: boolean, service: ServiceDetailsInterface }) => {
const theme = useContext(ThemeContext);
const unavailable = !service.price
const timeUntilArrival = i18n.t('rideDetails.timeUntilArrival', {minutes: moment.duration(moment(service.eta).diff(moment())).minutes().toString()})
const unavailableText = i18n.t('rideDetails.unavailable')
console.log(unavailable)
const tagStyles = {
    [TAG_OPTIONS.FASTEST]: {
        container: {
            backgroundColor: theme.primaryColor
        },
        textColor: theme.primaryButtonTextColor
    },
    [TAG_OPTIONS.CHEAPEST]: {
        container: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.primaryColor
        },
        textColor: theme.primaryColor
    }
}
return (
    <CardContainer theme={theme} selected={selected} noBg>
        <CarContainer>
            <CarIcon source={{uri: service.iconUrl}}/>
        </CarContainer>
        <ServiceDetails unavailable={unavailable} >
            <TopRow>
                <Title>
                    {service.name}
                </Title>
                {service.tag && <Tag containerStyles={tagStyles[service.tag].container} text={service.tag} textColor={tagStyles[service.tag].textColor} />}
                <Price>
                    {service.price || unavailableText}
                </Price>
            </TopRow>
            {!unavailable && <Row>
                <TimeDetails>
                    <Eta>
                        {moment(service.eta).format('HH:mm')}
                    </Eta>
                    <Circle />
                    <Eta>
                        {timeUntilArrival}
                    </Eta>
                </TimeDetails>
                <Capacity>
                    <AvailableSeats>
                        {service.availableSeats}
                    </AvailableSeats>
                    <SvgIcon svg={Seat}/>
                </Capacity>
            </Row>}
            {service.description && <Row>
                <Description>
                    {service.description}
                </Description>
            </Row>}
        </ServiceDetails>
    </CardContainer>
  )
}

export default ServiceCard;