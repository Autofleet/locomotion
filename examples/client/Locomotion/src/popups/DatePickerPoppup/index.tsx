import React, { useState } from 'react';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';

import {
  ModalContainer, ConfirmButton, CancelButton,
} from './styled';
import { isAndroid } from '../../services/isAndroid';

export default ({
  title, date, onChange, isVisible, onConfirm, onCancel, confirmText, cancelText, ...props
}) => {
  const [currentDate, setCurrentDate] = useState(date);
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
          date={date}
          modal={false}
          onDateChange={(newDate) => {
            setCurrentDate(newDate);
            onChange(newDate);
          }}
          style={{ marginTop: isAndroid ? 10 : 0, marginBottom: isAndroid ? 10 : 0 }}
        />
        <ConfirmButton onPress={() => onConfirm(currentDate)}>{confirmText}</ConfirmButton>
        <CancelButton onPress={onCancel} hollow>{cancelText}</CancelButton>

      </ModalContainer>
    </Modal>
  );
};
