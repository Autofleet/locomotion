import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import diff from 'object-diff';
import * as Yup from 'yup';
import serviceHoursContainer from '../../contexts/serviceHoursContainer';

import Form from './form';

const requiredField = Yup.string().required('Field requierd');

const AddUser = ({
  initialValues,
  onCancel,
  popupName,
}) => {
  const workingHours = serviceHoursContainer.useContainer();

  const requiredUniqueField = field => Yup.string().required(('popup.validateRequired'))

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      {...{ initialValues }}
       validationSchema={Yup.object().shape({
        dayInWeek: requiredField,
        startTime: requiredField,
        endTime: requiredField,
        timezone: requiredField,
      })}
      onSubmit={async (values, actions) => {
        console.log(values);

 actions.setSubmitting(true);
        try {
          await workingHours.AddSlot(values)
        } catch (error) {
          console.log(error);
          //appContext.throwClientError({ consoleError: error });
        }
        actions.setSubmitting(false);
        onCancel();
      }}
      render={props => (
        <Form
          {...props}
          editMode
          onCancel={() => {
            onCancel();
          }}
        />
      )}
    />
  );
};

export default AddUser;

AddUser.defaultProps = {
  editMode: false,
  onCancel: undefined,
  popupName: false,
  initialValues: {}
};

AddUser.propTypes = {
  editMode: PropTypes.bool,
  popupName: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onCancel: PropTypes.func,
  initialValues: PropTypes.shape({}).isRequired,
};

