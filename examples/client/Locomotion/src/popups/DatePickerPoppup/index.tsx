import React, { useState, useEffect } from 'react';
import DatePicker, { DatePickerProps } from 'react-native-date-picker';
import Modal from '../../Components/CompatModal';
import { getUserLanguageCode } from '../../I18n';

import {
  ModalContainer, ConfirmButton, CancelButton,
} from './styled';
import { isAndroid } from '../../services/isAndroid';

type DatePickerPoppupProps = Omit<DatePickerProps, 'date' | 'onDateChange' | 'modal' | 'theme' | 'locale' | 'is24hourSource' | 'style' | 'title' | 'confirmText' | 'cancelText'> & {
  date: Date;
  isVisible: boolean;
  title?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onChange: (date: Date) => void;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
};

export default ({
  title, date, onChange, isVisible, onConfirm, onCancel, confirmText, cancelText, ...props
}: DatePickerPoppupProps) => {
  const [currentDate, setCurrentDate] = useState(date);
  useEffect(() => {
    setCurrentDate(date);
  }, [date]);
  return (
    <Modal
      isVisible={isVisible}
      style={{
        flexDirection: 'column', justifyContent: 'flex-end', padding: 0, margin: 0,
      }}
    >
      <ModalContainer>
        {title}
        <DatePicker
          {...props}
          theme="light"
          locale={getUserLanguageCode()}
          is24hourSource="locale"
          date={date}
          modal={false}
          onDateChange={(newDate) => {
            setCurrentDate(newDate);
            onChange(newDate);
          }}
          style={{ marginTop: isAndroid ? 10 : 0, marginBottom: isAndroid ? 10 : 0 }}
        />
        <ConfirmButton onPress={() => onConfirm(currentDate)} testID="datePickerConfirm">{confirmText}</ConfirmButton>
        <CancelButton onPress={onCancel} hollow testID="datePickerCancel">{cancelText}</CancelButton>

      </ModalContainer>
    </Modal>
  );
};
