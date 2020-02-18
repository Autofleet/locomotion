/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, Form } from 'formik';

import InputWithLabel, { PhoneInput } from '../../Common/InputWithLabel'

// import AddressSelector from '../../Components/AddressSelector';
// import SelectFromAvailableEntities from '../../Components/SelectFromAvailableEntities';
import Toggle from '../../Common/Toggle';
import PopupDialog from '../../Common/PopupDialog';
import { ReactComponent as PlusIcon } from '../../assets/plus.svg'

import {
  ImageUploaderContainer,
  Image,
  PopupFormContainer,
  DriverAvatarContainer,
  DriverAvatarContainerInner,
  DriverAvatar,
  RightSidePopupForm,
  FormInputsSection,
  ToggleContainer
} from './styled';
const getUrl = value => (typeof value === 'object' ? value.url : value);

const AvatarField = ({
  form,
  field: { value, onChange, ...field },
  ...props
}) => (
  <ImageUploaderContainer>
    <Image
      src={value ? getUrl(value) : 'https://res.cloudinary.com/autofleet/image/upload/v1531728314/Control-Center/person.jpg'}
    />
  </ImageUploaderContainer>
);

AvatarField.propTypes = {
  form: PropTypes.shape({}).isRequired,
  field: PropTypes.shape({}).isRequired,
};

const AddDriverForm = ({
  isValid,
  values,
  errors,
  editMode,
  onCancel,
  setFieldValue,
}) => {
  console.log(values);

  return(
  <Form name="addDriverForm">
    <PopupDialog
      padding="0px"
      width="80vw"
      title={editMode
        ? ('ManagementDriversEditDriverPopupTitle')
        : ('ManagementDriversAddDriverPopupTitle')
      }
      closeButtonTitle="Close"
      submitButtonTitle={editMode
        ? 'Save'
        : 'Create'
      }
      {...{ onCancel }}
      maxWidth="750px"
    >
      <PopupFormContainer>
          <DriverAvatarContainer>
            <DriverAvatarContainerInner>
              <Field
                name="avatar"
                component={AvatarField}
                className={DriverAvatar}
              />
            </DriverAvatarContainerInner>
          </DriverAvatarContainer>
        <FormInputsSection>
          <RightSidePopupForm>
            <Field
              name="firstName"
              label={('PopupFirstName')}
              type="text"
              errorMessage={errors.firstName}
              component={InputWithLabel}
              />
            <Field
              name="lastName"
              label={('PopupPopupLastName')}
              type="text"
              errorMessage={errors.lastName}
              component={InputWithLabel}
              />

          </RightSidePopupForm>
          <RightSidePopupForm>
            <Field
                name="phoneNumber"
                label={('PopupPopupCell')}
                type="tel"
                errorMessage={errors.phoneNumber}
                inputComponent={PhoneInput}
                component={InputWithLabel}
                onChange={(phoneNumber) => {
                  setFieldValue('phoneNumber', phoneNumber ? phoneNumber.match(/\d+/g).join('') : '')
                }}
                />
              <Field
                name="email"
                label={('Email')}
                type="text"
                errorMessage={errors.email}
                component={InputWithLabel}
                />
                <ToggleContainer>
                  <Toggle
                    labelText="Active"
                    value={`toggle_active`}
                    checked={values.active}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setFieldValue('active', true)
                      } else {
                        setFieldValue('active', false)
                      }
                    }}
                    />
                </ToggleContainer>
          </RightSidePopupForm>
        </FormInputsSection>
      </PopupFormContainer>
    </PopupDialog>
  </Form>
)};

AddDriverForm.propTypes = {
  values: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  editMode: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default AddDriverForm;
