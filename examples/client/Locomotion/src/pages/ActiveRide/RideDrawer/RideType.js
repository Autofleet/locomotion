import React from 'react';
import {
  RowContainer, RideTypeButton, RideTypeButtonText,
} from './styled';

const values = [
  { value: 'private', label: 'Private' },
  { value: 'pool', label: 'Shared' },
];

export default ({ rideType, setRideType }) => (
  <RowContainer>
    {values.map(v => (
      <RideTypeButton onPress={() => setRideType(v.value)} testID={`${v.label}-RideTypeButton`}>
        <RideTypeButtonText active={rideType === v.value}>
          {' '}
          {v.label}
          {' '}
        </RideTypeButtonText>
      </RideTypeButton>
    ))}
  </RowContainer>
);
