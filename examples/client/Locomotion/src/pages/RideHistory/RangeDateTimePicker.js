import React, { useRef, useState } from 'react';
import DatePicker from 'react-native-date-picker';
import i18n, { getUserLanguageCode } from '../../I18n';

export default ({ onCancel, onConfirm }) => {
  const today = useRef(new Date()).current;
  const [open, setOpen] = useState(true);
  const [fromDate, setFromDate] = useState(null);

  const handleConfirm = (date) => {
    if (fromDate) {
      onConfirm(fromDate, date);
    } else {
      setOpen(false);
      setFromDate(date);
      setTimeout(() => setOpen(true), 500);
    }
  };

  return (
    <DatePicker
      testID="datePicker"
      modal
      open={open}
      locale={getUserLanguageCode()}
      date={today}
      maximumDate={today}
      minimumDate={fromDate || undefined}
      mode="date"
      title={fromDate
        ? i18n.t('rideHistory.rangeDateTimePicker.selectEndDate')
        : i18n.t('rideHistory.rangeDateTimePicker.selectStartDate')}
      confirmText={i18n.t('rideHistory.rangeDateTimePicker.confirmText')}
      cancelText={i18n.t('rideHistory.rangeDateTimePicker.cancelText')}
      onConfirm={handleConfirm}
      onCancel={onCancel}
    />
  );
};
