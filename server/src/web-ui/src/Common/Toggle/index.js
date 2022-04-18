/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';

//import styles from './index.scss';
import {ToggleLabel, ToggleInput, TogglerBody, LabelText} from './styled'
const Toggle = ({
  form,
  field,
  labelText,
  ...props
}) => (
  <ToggleLabel>
    {labelText ? <LabelText>{labelText}</LabelText> : null}
    <ToggleInput {...props} {...field} />
    <TogglerBody data-test-id="toggleDiv" />
  </ToggleLabel>
);

Toggle.propTypes = {
  field: PropTypes.shape({}),
  form: PropTypes.shape({}),
};
Toggle.defaultProps = {
  field: undefined,
  form: undefined,
};

export default Toggle;
