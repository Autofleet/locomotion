import React, { Fragment } from "react";
import RideDetails from "./RideDetails";
import ServiceOptions from "./ServiceOptions";

const RideOptions = () => {
  return (
    <Fragment>
      <ServiceOptions />

      <RideDetails />

    </Fragment>
  )
}

export default RideOptions;