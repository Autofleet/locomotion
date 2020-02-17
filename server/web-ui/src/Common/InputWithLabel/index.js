/* eslint-disable */
import React from 'react';


import propsTypes from 'prop-types';
import styles from './index.scss';

import { Input, PhoneInput, RoundedPhoneInput } from '../Input'


const popupErrorMessageStyle = (errorAlign) => ({
  textAlign: errorAlign || 'right',
});

const InputWithLabel = ({
  inputId,
  type,
  label,
  icon,
  errorMessage,
  errorMessageAlignment,
  form,
  disabled,
  field,
  inputComponent: InputComponent,
  ...props
}) => (
  <label
    htmlFor={inputId}
    className={`${styles.formGroup} ${styles.formGroupLabelContainer} ${disabled ? styles.formGroupDisabled : ''}`}
  >
    <span className={styles.formGroupLabel}>{label}</span>
    <div className={styles.inputGroup}>
      <InputComponent
        withBorder
        withHover
        id={inputId}
        {...{ type, disabled }}
        {...field}
        {...props}
      />
      <img className={styles.formGroupIcon} src={icon} alt="" />
      {errorMessage &&
        <span className={styles.errorMessage} style={popupErrorMessageStyle(errorMessageAlignment)}>
          {errorMessage}
        </span>
      }
    </div>
  </label>
);

export default InputWithLabel;

export { PhoneInput };
export { RoundedPhoneInput };

InputWithLabel.defaultProps = {
  inputId: '',
  placeholder: '',
  type: 'text',
  icon: '',
  label: '',
  errorMessage: '',
  errorMessageAlignment: false,
  inputComponent: Input,
  form: null,
  field: null,
  disabled: false,
};

InputWithLabel.propTypes = {
  inputId: propsTypes.string,
  placeholder: propsTypes.string,
  type: propsTypes.string,
  icon: propsTypes.string,
  label: propsTypes.string,
  errorMessage: propsTypes.string,
  inputComponent: propsTypes.oneOfType([propsTypes.func, propsTypes.shape({})]),
  form: propsTypes.shape({}),
  field: propsTypes.shape({}),
  disabled: propsTypes.bool,
};
