import React, { useState, useEffect } from 'react';


import SelectModal from '../../../../../../Components/SelectModal';


const PassengersCounter = ({
  service, onSelect, onError = () => null, value,
}) => {
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
    onSelect(item?.value);
  };
  return (
    <SelectModal
      data={passengersOptions}
      onSelect={onItemSelect}
      onError={onError}
      defaultValue={value}
    />
  );
};

export default PassengersCounter;
