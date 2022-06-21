import React, { Fragment } from 'react';
import RideButtons from './RideButtons';
import RideDetails from './RideDetails';
import ServiceOptions from './ServiceOptions';

const RideOptions = () => (
  <Fragment>
    <ServiceOptions />
    <RideButtons />
  </Fragment>
);

export default RideOptions;
