import { RidePageContext } from "../../../../../context/newRideContext";
import React, { useContext } from "react";
import ServiceCard from "./ServiceCard";
import { ServiceOptionsContainer } from "./styles";

const ServiceOptions = () => {
const { serviceEstimations } = useContext(RidePageContext)

  return (
    <ServiceOptionsContainer alwaysBounceVertical={false}>
        <>
        {serviceEstimations.map((option) => {
            return <ServiceCard service={option} selected={false} />
        })}
        </>
    </ServiceOptionsContainer>
  )
}

export default ServiceOptions;