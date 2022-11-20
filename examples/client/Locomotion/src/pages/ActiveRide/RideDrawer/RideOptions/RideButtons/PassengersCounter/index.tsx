import React, { useState, useEffect } from 'react';


import SelectPop from '../../../../../../Components/SelectModal';


const PassengersCounter = ({ service, onSelect, onError = () => null }) => {
  useEffect(() => {
    if (service?.availableSeats) {
      const array = [];
      for (let i = 1; i <= service.availableSeats; i += 1) {
        array.push({ label: i, value: i });
      }
      setPassengersOptions(array);
    }
  }, [service]);

  const [passengersOptions, setPassengersOptions] = useState([]);

  const onItemSelect = (item) => {
    onSelect(item.value);
  };
  return (
    <SelectPop
      data={passengersOptions}
      onSelect={onItemSelect}
      onError={onError}
    />
  );
};

export default PassengersCounter;
