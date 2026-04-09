import React, { useState, useEffect } from 'react';

import SelectModal from '../../../../../../Components/SelectModal';

interface Item {
  value: number;
  label: string;
}

interface SelectModalItem {
  value: string | number;
  label: string;
}

interface PassengersCounterProps {
  service: { availableSeats?: number } | null;
  onSelect: (value: number) => void;
  onError?: (error: boolean) => void;
  selectedValue?: number | null;
}

const PassengersCounter = ({
  service, onSelect, onError = () => undefined, selectedValue = null,
}: PassengersCounterProps) => {
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

  const onItemSelect = (item: SelectModalItem) => {
    if (typeof item?.value === 'number') {
      onSelect(item.value);
    }
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
