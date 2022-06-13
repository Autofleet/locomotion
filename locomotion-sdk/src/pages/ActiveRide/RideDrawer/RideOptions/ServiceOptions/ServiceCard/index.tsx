import SvgIcon from "../../../../../../Components/SvgIcon";
import i18n from "../../../../../../I18n";
import moment from "moment";
import Seat from '../../../../../../assets/seat.svg'
import React, { useContext } from "react";
import { ServiceDetailsInterface } from "..";
import { Context as ThemeContext } from '../../../../../../context/theme';
import { Circle, AvailableSeats, Capacity, CardContainer, CarIcon, Eta, Row, Price, ServiceDetails, Tag, TagText, TimeDetails, Title, Description, TopRow } from "./styled";

const ServiceCard = ({ selected, service }: { selected: boolean, service: ServiceDetailsInterface }) => {
const theme = useContext(ThemeContext);
  return (
    <CardContainer theme={theme} selected={selected}>
        <CarIcon source={{uri: service.iconUrl}}/>
        <ServiceDetails>
            <TopRow>
                <Title>
                    {service.name}
                </Title>
                {service.tag && <Tag>
                    <TagText>
                    {service.tag}
                    </TagText>
                </Tag>}
                <Price>
                    {service.price}
                </Price>
            </TopRow>
            <Row>
                <TimeDetails>
                    <Eta>
                        {moment(service.eta).format('HH:mm')}
                    </Eta>
                    <Circle />
                    <Eta>
                        {i18n.t('rideDetails.timeUntilArrival', {minutes: moment.duration(moment(service.eta).diff(moment())).minutes().toString()})}
                    </Eta>
                </TimeDetails>
                <Capacity>
                    <AvailableSeats>
                        {service.availableSeats}
                    </AvailableSeats>
                    <SvgIcon svg={Seat}/>
                </Capacity>
            </Row>
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