import { ServiceDetailsInterface } from "context/rideServicesContext/mockServiceEstimations";
import React, { useContext, useEffect, useState } from "react";
import { RideServicesContext } from "../../../../../context/rideServicesContext";
import ServiceCard from "./ServiceCard";
import { ServiceOptionsContainer } from "./styles";

const ServiceOptions = () => {
    const { getServiceEstimations } = useContext(RideServicesContext);
    const [serviceEstimations, setServiceEstimations] = useState<ServiceDetailsInterface[]>([])

    const generateServiceEstimationsState = () => {
        const estimations = getServiceEstimations()
        setServiceEstimations(estimations)
    }

    useEffect(() => {
        generateServiceEstimationsState()
    })
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