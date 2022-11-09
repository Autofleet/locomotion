import React, { useState } from 'react';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';

import {
  ModalContainer, ConfirmButton, CancelButton,
} from './styled';
import { isAndroid } from '../../services/isAndroid';

export default ({
  title, date, onChange, isVisible, onConfirm, onCancel, ...props
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
          onDateChange={(date) => {
            setCurrentDate(date);
            onChange(date);
          }}
          style={{ marginTop: isAndroid ? 10 : 0, marginBottom: isAndroid ? 10 : 0 }}
        />
        <ConfirmButton onPress={() => onConfirm(currentDate)}>Confirm</ConfirmButton>
        <CancelButton onPress={onCancel} hollow>Cancel</CancelButton>

      </ModalContainer>
    </Modal>
  );
};
