import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import diff from 'object-diff';
import * as Yup from 'yup';
import usersContainer from '../../contexts/usersContainer';

import Form from './form';

const requiredField = Yup.string().required('Field requierd');

const AddUser = ({
  initialValues,
  editMode,
  onCancel,
  driverId,
  popupName,
}) => {
  const users = usersContainer.useContainer();
  const requiredUniqueField = field => Yup.string().required(('popup.validateRequired'))
    .test('unique', (`UNIQUE ${field}`), value =>
      !users.usersMap.find(({ [field]: fieldValue, id }) =>
        fieldValue === value && id !== initialValues.id));

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      {...{ initialValues }}
      validationSchema={Yup.object().shape({
        firstName: requiredField,
        lastName: requiredField,
        phoneNumber: requiredUniqueField('phoneNumber'),
        email: requiredUniqueField('email').email(),
      })}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);
        console.log(values);
        const { ...otherValues } = popupName === 'AddUser'
          ? values : diff(initialValues, values);
        try {
          if (popupName === 'AddUser') {
            await users.AddUser(otherValues);
          } else {
            await users.UpdateUser(values.id, otherValues);
          }
        } catch (error) {
          console.log(error);
          // appContext.throwClientError({ consoleError: error });
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
  initialValues: {},
};

AddUser.propTypes = {
  editMode: PropTypes.bool,
  popupName: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onCancel: PropTypes.func,
  initialValues: PropTypes.shape({}).isRequired,
};
