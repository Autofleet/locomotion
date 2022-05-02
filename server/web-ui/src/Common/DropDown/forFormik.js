import React from 'react';
import { Field } from 'formik';

const DropDown = require('./index');

const MySelect = ({ name, options, ...props }) => (
  <Field
    {...props}
    component={DropDown}
  />
);
export default MySelect;
