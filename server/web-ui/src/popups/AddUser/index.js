import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import diff from 'object-diff';
import { get } from 'lodash';
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
  console.log('initialValues', initialValues);

    const users = usersContainer.useContainer();
    const requiredUniqueField = field => Yup.string().required(('popup.validateRequired'))
      .test('unique', (`UNIQUE ${field}`), value =>
        !users.usersMap.find(({ [field]: fieldValue, id }) =>
          fieldValue === value && id !== initialValues.id))

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
        const { avatar, ...otherValues } = popupName === 'AddUser'
          ? values : diff(initialValues, values);
        const imageFile = get(values.avatar, 'file');
        if (imageFile) {
          console.log('INNN IMAGE FILE');

          try {
            const uploadResponse = await users.uploadImage(imageFile);
            console.log('UPLOAD RESP');

            console.log(uploadResponse);

            otherValues.avatar = uploadResponse.url;
          } catch (e) {
            //actions.setErrors({ avatar: JSON.stringify(e) });
            console.log('ERROR UPLOAD');
            console.log(e);

            //throw e;
          }
        }

        try {
          if (popupName === 'AddUser') {
            await users.AddUser(otherValues);
          } else {
            console.log('UPDATINGGG ');

            await users.UpdateUser(values.id, otherValues);
          }
        } catch (error) {
          console.log(error);

          //appContext.throwClientError({ consoleError: error });
        }
//
        actions.setSubmitting(false);
        //onCancel();
      }}
      render={props => (
        <Form
          {...props}
          onCancel={() => {
            onCancel();
          }}
        />
      )}
    />
  );
};

export default AddUser;

AddUser.propTypes = {
  popupName: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  driverId: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  onCancel: PropTypes.func,
  initialValues: PropTypes.shape({}).isRequired,
};
AddUser.defaultProps = {
  driverId: '',
  onCancel: undefined,
  popupName: false,
};
