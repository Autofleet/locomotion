import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
//import diff from 'object-diff';
import { get } from 'lodash';
import * as Yup from 'yup';

import Form from './form';

const requiredField = Yup.string().required('Field requierd');

const AddUser = ({
  initialValues,
  timeSlots,
  editMode,
  availableVendors,
  onCancel,
  driverId,
  popupName,
}) => {
/*   const requiredUniqueField = field => Yup.string().required(i18n.t('popup.validateRequired'))
    .test('unique', i18n.t(`management.drivers.validate.${field}`), value =>
      !driversManager.find(({ [field]: fieldValue, id }) =>
        fieldValue === value && id !== driversManager.driverId));
 */
  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      {...{ initialValues }}
/*       validationSchema={Yup.object().shape({
        firstName: requiredField,
        lastName: requiredField,
        phoneNumber: requiredUniqueField('phoneNumber'),
        externalId: requiredUniqueField('externalId').nullable(),
      })}
      onSubmit={async (values, actions) => {
        actions.setSubmitting(true);

        const { avatar, ...otherValues } = popupName === 'AddUser'
          ? values
          : diff(initialValues, values);

        const imageFile = get(values.avatar, 'file');

        if (imageFile) {
          try {
            const uploadResponse = await driversManager.uploadDriverImage(imageFile);
            otherValues.avatar = uploadResponse.url;
          } catch (e) {
            actions.setErrors({ avatar: JSON.stringify(e) });
            throw e;
          }
        }
        try {
          if (popupName === 'AddUser') {
            await driversManager.AddUser(otherValues);
          } else {
            await driversManager.updateDriver(driverId, otherValues);
          }
        } catch (error) {
          appContext.throwClientError({ consoleError: error });
        }

        actions.setSubmitting(false);
        onCancel();
      }} */
      render={props => (
        <Form
          {...props}
          onCancel={() => {
            //onCancel();
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
