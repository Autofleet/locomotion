/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, Form } from 'formik';

// import InputWithLabel, { PhoneInput } from '../../Components/InputWithLabel';
// import AddressSelector from '../../Components/AddressSelector';
// import SelectFromAvailableEntities from '../../Components/SelectFromAvailableEntities';
// import Toggle from '../../Components/Toggle';
import PopupDialog from '../../Common/PopupDialog';
import styles from './index.scss';

import {
  NextShiftsContainer,
  ToggleContainer,
  LeftSidePopupForm,
  NextShiftsTitle,
  NextShiftsBody,
  ImageUploaderContainer,
  ImageUploader,
  Image,
  UploadButton,
  PlusIcon,
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
    <UploadButton>
      <PlusIcon />
      <ImageUploader
        onChange={(event) => {
          if (value && value.url) {
            if (/^blob:/.test(value.url)) {
              URL.revokeObjectURL(value.url);
            }
          }

          event.target = { // eslint-disable-line no-param-reassign
            name: event.target.name,
            value: {
              url: URL.createObjectURL(event.target.files[0]),
              file: event.target.files[0],
            },
          };
          onChange(event);
        }}
        {...field}
        {...props}
      />
    </UploadButton>
  </ImageUploaderContainer>
);

AvatarField.propTypes = {
  form: PropTypes.shape({}).isRequired,
  field: PropTypes.shape({}).isRequired,
};

const AddDriverForm = ({
  driverId,
  isValid,
  values,
  errors,
  timeSlots,
  editMode,
  onCancel,
  availableVendors,
  setFieldValue,
}) => {
  return(
  <Form name="addDriverForm">
    <PopupDialog
      padding="0px"
      width="80vw"
      title={editMode
        ? ('ManagementDriversEditDriverPopupTitle')
        : ('ManagementDriversAddDriverPopupTitle')
      }
      closeButtonTitle={('PopupCancel')}
      submitButtonTitle={editMode
        ? 'applyChanges'
        : ('addDriverPopupTitle')
      }
      {...{ onCancel }}
      maxWidth="750px"
    >
      <div className={styles.popupFormContainer}>
        <LeftSidePopupForm>
          <div className={styles.driverAvatarContainer}>
            <div className={styles.driverAvatarContainerInner}>
              <Field
                name="avatar"
                component={AvatarField}
                className={styles.driverAvatar}
              />
            </div>
          </div>
          <NextShiftsContainer>
            <NextShiftsTitle>{('PopupNextShiftsTitle')}</NextShiftsTitle>
            <NextShiftsBody>
              <FieldArray
                validateOnChange={false}
                name="preferredTimeSlotsIds"
                render={({ push, remove }) => timeSlots
                  .map(({ id, name }, index) => (
                    <ToggleContainer key={id}>
                      <span className={styles.toggleText}>{name}</span>
                      <Toggle
                        data-test-id={`toggle_${index}`}
                        value={id}
                        checked={values.preferredTimeSlotsIds.includes(id)}
                        onChange={(event) => {
                          if (event.target.checked) {
                            push(event.target.value);
                          } else {
                            remove(values.preferredTimeSlotsIds.indexOf(event.target.value));
                          }
                        }}
                      />
                    </ToggleContainer>
                  ))}
              />
            </NextShiftsBody>
          </NextShiftsContainer>
        </LeftSidePopupForm>
        <div
          className={styles.rightSidePopupForm}
          style={{ marginTop: '22px' }}
        >
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
          <SelectFromAvailableEntities
            data={availableVendors}
            filedName="vendorId"
            i18nLabel="popup.labelVendor"
            errorMessage={errors.vendorText || errors.vendorId}
            setFieldValue={setFieldValue}
            textKey="vendorText"
          />
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
            name="address"
            label={('PopupPopupAddress')}
            component={InputWithLabel}
            inputComponent={AddressSelector}
            onSelectAddress={async ({ label }, asyncLocation) => {

              const { lat, lng } = await asyncLocation;
              setFieldValue('address', label);
              setFieldValue('addressLat', lat);
              setFieldValue('addressLng', lng);
            }}
          />
          <Field
            name="externalId"
            label={('PopupLabelExternalId')}
            type="text"
            errorMessage={errors.externalId}
            component={InputWithLabel}
          />
        </div>
      </div>
    </PopupDialog>
  </Form>
)};

AddDriverForm.propTypes = {
  values: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  timeSlots: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  editMode: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  availableVendors: PropTypes.arrayOf(PropTypes.shape({})),
  setFieldValue: PropTypes.func.isRequired,
};

export default AddDriverForm;
