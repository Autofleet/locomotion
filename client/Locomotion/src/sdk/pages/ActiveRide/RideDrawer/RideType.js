import React from 'react';
import {
    RowContainer, RideTypeButton, RideTypeButtonText
  } from './styled';

const values  = [
    { value: 'private', label: 'Private'},
    { value: 'pool', label: 'Shared'},
]

export default ({ rideType, setRideType }) => {
    return (
        <RowContainer>
            {values.map(v => (
                <RideTypeButton onPress={() => setRideType(v.value)}>
                    <RideTypeButtonText active={rideType === v.value }> {v.label} </RideTypeButtonText>
                </RideTypeButton>
            ))}
    </RowContainer>
    )
}