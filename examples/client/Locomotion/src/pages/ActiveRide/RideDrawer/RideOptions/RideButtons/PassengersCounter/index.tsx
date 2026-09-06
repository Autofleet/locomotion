import React, { useState, useEffect } from 'react';


import SelectModal from '../../../../../../Components/SelectModal';

interface Item {
  value: number;
  label: string;
}

const PassengersCounter = ({
  service, onSelect, onError = () => null, selectedValue = null,
}: any) => {
  const [passengersOptions, setPassengersOptions] = useState<Item[]>([]);

  useEffect(() => {
    if (service?.availableSeats) {
      const array = [];
      for (let i = 1; i <= service.availableSeats; i += 1) {
        array.push({ label: i.toString(), value: i });
      }
      setPassengersOptions(array);
    }
  }, [service]);


  const onItemSelect = (item: Item) => {
    onSelect(item?.value);
  };
  return (
    <SelectModal
      data={passengersOptions}
      onSelect={onItemSelect}
      onError={onError}
      selectedValue={selectedValue}
    />
  );
};
export default PassengersCounter;
