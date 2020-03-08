import React from "react";
import {
    NumberInput,
    SettingsPanel,
    SettingsPanelHeader,
    SettingsPanelItem,
    FieldLabelText,
    ApplyButton,
    SettingsContainer,
} from "./styled";
import PropTypes from 'prop-types';
import { Field, FieldArray, Form } from 'formik';
import i18n from '../../i18n';
import Toggle from '../../Common/Toggle';
import InputWithLabel from "../../Common/InputWithLabel";
import {ErrorMessage} from "../../Common/InputWithLabel/styled";

const SettingsForm = ({
                        values,
                        errors,
                        setFieldValue,
                        displayLoader
                      }) => {
    return(
        <Form name="settingsForm" style={{height: '100%'}} >
            <SettingsContainer>
                <SettingsPanel>
                    <SettingsPanelHeader>General</SettingsPanelHeader>

                    <SettingsPanelItem type='toggle'>
                        <FieldLabelText>{i18n.t('settings.labels.activateUsersLabel')}</FieldLabelText>
                        <Toggle
                            value={`MANUAL_APPROVAL`}
                            checked={values['MANUAL_APPROVAL']}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    setFieldValue('MANUAL_APPROVAL', true)
                                } else {
                                    setFieldValue('MANUAL_APPROVAL', false)
                                }
                            }}
                        />
                    </SettingsPanelItem>

                    <SettingsPanelItem type='text'>
                        <Field
                            name="TERMS_URL"
                            label={i18n.t('settings.labels.termsUrlLabel')}
                            type="text"
                            errorMessage={errors.TERMS_URL}
                            component={InputWithLabel}
                        />
                    </SettingsPanelItem>

                    <SettingsPanelItem type='text'>
                        <Field
                            name="PRIVACY_URL"
                            label={i18n.t('settings.labels.PrivacyUrlLabel')}
                            type="text"
                            errorMessage={errors.PRIVACY_URL}
                            component={InputWithLabel}
                        />
                    </SettingsPanelItem>

                    <SettingsPanelItem type='text'>
                        <Field
                            name="CONTACT_US_URL"
                            label={i18n.t('settings.labels.ContactUsUrlLabel')}
                            type="text"
                            errorMessage={errors.CONTACT_US_URL}
                            component={InputWithLabel}
                        />
                    </SettingsPanelItem>

                    <SettingsPanelItem type='text'>
                        <FieldLabelText>{i18n.t('settings.labels.MinArriveReminderLabel')}</FieldLabelText>
                        <Field
                            name="ARRIVE_REMINDER_MIN"
                            value={values['ARRIVE_REMINDER_MIN']}
                            type="number"
                            component={NumberInput}
                            min="0"
                            onChange={event => setFieldValue('ARRIVE_REMINDER_MIN', event.target.value)}
                        />
                        <ErrorMessage style={{textAlign: 'right'}}>
                            {errors.ARRIVE_REMINDER_MIN}
                        </ErrorMessage>
                    </SettingsPanelItem>

                    <SettingsPanelItem type='submit'>
                        <ApplyButton
                            redButtons={false}
                            disabled={false}
                            type="submit"
                            data-test-id="submitSettings"
                            title={i18n.t('settings.labels.saveButton')}
                            displayLoader={displayLoader}
                        />
                    </SettingsPanelItem>
                </SettingsPanel>
                <SettingsPanel transparent placeholder />
            </SettingsContainer>
        </Form>
)};

SettingsForm.propTypes = {
    values: PropTypes.shape({}).isRequired,
    errors: PropTypes.shape({}).isRequired,
    setFieldValue: PropTypes.func.isRequired,
    displayLoader: PropTypes.bool.isRequired,
};

export default SettingsForm;
