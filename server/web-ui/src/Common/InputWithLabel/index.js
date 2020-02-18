/* eslint-disable */
import React from 'react';


import propsTypes from 'prop-types';
//import styles from './index.scss';
import {FormGroupLabel, InputGroup, FormGroup, FormGroupIcon, ErrorMessage} from './styled';
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
  <FormGroup
    htmlFor={inputId}
  >
    <FormGroupLabel>{label}</FormGroupLabel>
    <InputGroup>
      <InputComponent
        withBorder
        withHover
        id={inputId}
        {...{ type, disabled }}
        {...field}
        {...props}
      />
      <FormGroupIcon src={icon} alt="" />
      {errorMessage &&
        <ErrorMessage style={popupErrorMessageStyle(errorMessageAlignment)}>
          {errorMessage}
        </ErrorMessage>
      }
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
