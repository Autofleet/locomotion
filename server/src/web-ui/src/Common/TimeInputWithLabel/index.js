/* eslint-disable */
import React from 'react';


import propsTypes from 'prop-types';
//import styles from './index.scss';
import {FormGroupLabel, InputGroup, FormGroup, FormGroupIcon, ErrorMessage} from './styled';
import { Input, PhoneInput, RoundedPhoneInput } from '../Input'
import TimeField from 'react-simple-timefield';

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
  marginTop,
  inlineField,
  ...props
}) => (
  <FormGroup
    htmlFor={inputId}
    marginTop={marginTop}
  >
    <FormGroupLabel inlineField={inlineField}>{label}</FormGroupLabel>
    <InputGroup inlineField={inlineField}>
      <TimeField
        id={inputId}
        {...field}
        {...props}
      />
      <FormGroupIcon src={icon} alt="" />
      <ErrorMessage style={popupErrorMessageStyle(errorMessageAlignment)} marginTop={marginTop}>
        {errorMessage}
      </ErrorMessage>

    </InputGroup>
  </FormGroup>
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
  inlineField: false
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
  inlineField: propsTypes.bool
};
