import moment, { Moment } from "moment";
import React from "react";
import { ImageURISource } from 'react-native'
import ServiceCard from "./ServiceCard";
import { ServiceOptionsContainer } from "./styles";

export interface ServiceDetailsInterface {
    name: string;
    eta: Moment;
    price: string;
    availableSeats: number;
    tag?: string;
    iconUrl: ImageURISource;
    description?: string;
}

const serviceOptions: ServiceDetailsInterface[] = [
    {
        name: 'Premium',
        eta: moment(Date.now()).add(30, 'm'),
        price: '$32.30',
        availableSeats: 4,
        tag: 'fastest',
        iconUrl: 'https://res.cloudinary.com/autofleet/image/upload/w_700,h_500,c_thumb,q_auto/vehicle-images/Minivan/minivan_green.png',
        description: "this is a description for a service"
    },
    {
        name: 'Premium',
        eta: moment(Date.now()).add(30, 'm'),
        price: '$32.30',
        availableSeats: 4,
        iconUrl: 'https://res.cloudinary.com/autofleet/image/upload/w_700,h_500,c_thumb,q_auto/vehicle-images/Minivan/minivan_green.png',
        description: "this is a description for a service"
    },
    {
        name: 'Premium',
        eta: moment(Date.now()).add(30, 'm'),
        price: '$32.30',
        availableSeats: 4,
        iconUrl: 'https://res.cloudinary.com/autofleet/image/upload/w_700,h_500,c_thumb,q_auto/vehicle-images/Minivan/minivan_green.png',
    }
]
const ServiceOptions = () => {
  return (
    <ServiceOptionsContainer>
        <>
        {serviceOptions.map((option) => {
            return <ServiceCard service={option} selected={true} />
        })}
        </>
    </ServiceOptionsContainer>
  )
}

export default ServiceOptions;