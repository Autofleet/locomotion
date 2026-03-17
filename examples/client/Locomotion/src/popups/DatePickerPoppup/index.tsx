import React, { useState, useEffect, ComponentProps } from 'react';
import DatePicker from 'react-native-date-picker';
import Modal from '../../Components/CompatModal';
import { getUserLanguageCode } from '../../I18n';

import {
  ModalContainer, ConfirmButton, CancelButton,
} from './styled';
import { isAndroid } from '../../services/isAndroid';

type DatePickerPassthroughProps = Omit<ComponentProps<typeof DatePicker>, 'date' | 'onDateChange' | 'locale' | 'is24hourSource' | 'modal' | 'style' | 'title'>;

interface DatePickerPoppupProps extends DatePickerPassthroughProps {
  title: React.ReactNode;
  date: Date;
  onChange: (date: Date) => void;
  isVisible: boolean;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  confirmText: string;
  cancelText: string;
  testID?: string;
}

export default function ({
  title, date, onChange, isVisible, onConfirm, onCancel, confirmText, cancelText, testID, ...props
}: DatePickerPoppupProps) {
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
}
