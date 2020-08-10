import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, Form } from 'formik';
import TimeField from 'react-simple-timefield';
import i18n from '../../i18n';
import InputWithLabel, { PhoneInput } from '../../Common/InputWithLabel';
import Toggle from '../../Common/Toggle';
import PopupDialog from '../../Common/PopupDialog';
import { ReactComponent as PlusIcon } from '../../assets/plus.svg';
import Drop from '../../Common/DropDown';
import momentTz from 'moment-timezone';

import {
  ImageUploaderContainer,
  Image,
  PopupFormContainer,
  DriverAvatarContainer,
  DriverAvatarContainerInner,
  DriverAvatar,
  RightSidePopupForm,
  FormInputsSection,
  ToggleContainer,
} from './styled';

const daysOfWeek = [
  { label: i18n.t('serviceHours.weekDays.sunday'), value: 0 },
  { label: i18n.t('serviceHours.weekDays.monday'), value: 1 },
  { label: i18n.t('serviceHours.weekDays.tuesday'), value: 2 },
  { label: i18n.t('serviceHours.weekDays.wednesday'), value: 3 },
  { label: i18n.t('serviceHours.weekDays.thursday'), value: 4 },
  { label: i18n.t('serviceHours.weekDays.friday'), value: 5 },
  { label: i18n.t('serviceHours.weekDays.saturday'), value: 6 },
];

const AddTimeSlotForm = ({
  values,
  errors,
  onCancel,
  setFieldValue,
}) => (
  <Form name="AddTimeSlot">
    <PopupDialog
      padding="0px"
      width="80vw"
      title={i18n.t('serviceHours.addTimeSlot.title')}
      closeButtonTitle={i18n.t('users.addUser.closeBtn')}
      submitButtonTitle={i18n.t('users.addUser.createBtn')}
      {...{ onCancel }}
      maxWidth="750px"
    >
      <PopupFormContainer>
        <FormInputsSection>
          <RightSidePopupForm>
            <Field
              name="dayInWeek"
              inputId="dayInWeek"
              label={i18n.t('serviceHours.addTimeSlot.dayInWeek')}
              type="text"
              errorMessage={errors.dayInWeek}
              component={Drop}
              onChange={selected => setFieldValue('dayInWeek', selected.value)}
              options={daysOfWeek}
            />

            <Field
              name="startTime"
              label={i18n.t('serviceHours.addTimeSlot.startTime')}
              type="text"
              errorMessage={errors.startTime}
              component={TimeField}
              onChange={(event, value) => setFieldValue('startTime', value)}
              input={<InputWithLabel />}
            />

          </RightSidePopupForm>
          <RightSidePopupForm>
            <Field
              name="timezone"
              label={i18n.t('serviceHours.addTimeSlot.timezone')}
              type="text"
              errorMessage={errors.timezone}
              component={Drop}
              onChange={selected => setFieldValue('timezone', selected.value)}
              options={momentTz.tz.names().map(tz => ({ label: tz, value: tz }))}
            />
            <Field
              name="endTime"
              label={i18n.t('serviceHours.addTimeSlot.endTime')}
              type="text"
              errorMessage={errors.endTime}
              component={TimeField}
              onChange={(event, value) => setFieldValue('endTime', value)}
              input={<InputWithLabel />}
            />

          </RightSidePopupForm>
        </FormInputsSection>
      </PopupFormContainer>
    </PopupDialog>
  </Form>
);

AddTimeSlotForm.propTypes = {
  values: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  onCancel: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default AddTimeSlotForm;
