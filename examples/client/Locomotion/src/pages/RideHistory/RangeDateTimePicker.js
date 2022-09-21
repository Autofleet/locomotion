import React, { useState } from 'react';
import DatePicker from 'react-native-date-picker';
import { getTextColorForTheme } from '../../context/theme';
import i18n from '../../I18n';

export default ({
  onCancel, onConfirm,
}) => {
  const [open, setOpen] = useState(true);
  const [fromDate, saveFromDate] = useState(false);
  const handleConfirm = async (date) => {
    await setOpen(false);
    if (fromDate) {
      onConfirm(fromDate, date);
    } else {
      await saveFromDate(date);
      await setOpen(true);
    }
  };

  return (
    <>
      <DatePicker
        testID="datePicker"
        textColor={getTextColorForTheme()}
        open={open}
        date={new Date()}
        maximumDate={new Date()}
        minimumDate={fromDate || undefined}
        mode="date"
        title={fromDate
          ? i18n.t('rideHistory.rangeDateTimePicker.selectEndDate')
          : i18n.t('rideHistory.rangeDateTimePicker.selectStartDate')}
        confirmText={i18n.t('rideHistory.rangeDateTimePicker.confirmText')}
        cancelText={i18n.t('rideHistory.rangeDateTimePicker.cancelText')}
        onCancel={() => onCancel()}
        onConfirm={handleConfirm}
        modal
      />
    </>
  );
};
