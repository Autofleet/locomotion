import React from "react";
import {
    NumberInput,
    SettingsPanel,
    SettingsPanelHeader,
    SettingsPanelItem,
    FieldLabelText,
    ApplyButton,
    SettingsContainer,
    SaveSettingsContainer,
} from "./styled";
import PropTypes from 'prop-types';
import { Field, FieldArray, Form } from 'formik';
import i18n from '../../i18n';
import Toggle from '../../Common/Toggle';
import InputWithLabel from "../../Common/InputWithLabel";

const SettingsForm = ({
                        values,
                        errors,
                        setFieldValue,
                        displayLoader
                      }) => {
    return(
        <Form name="settingsForm">
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
                            label={i18n.t('settings.labels.privacyUrlLabel')}
                            type="text"
                            errorMessage={errors.PRIVACY_URL}
                            component={InputWithLabel}
                        />
                    </SettingsPanelItem>

                    <SettingsPanelItem type='text'>
                        <Field
                            name="CONTACT_US_URL"
                            label={i18n.t('settings.labels.contactUsUrlLabel')}
                            type="text"
                            errorMessage={errors.CONTACT_US_URL}
                            component={InputWithLabel}
                        />
                    </SettingsPanelItem>
                </SettingsPanel>
                <SettingsPanel>
                    <SettingsPanelHeader>Ride</SettingsPanelHeader>

                    <SettingsPanelItem type='text'>
                        <Field
                            name="ARRIVE_REMINDER_MIN"
                            label={i18n.t('settings.labels.minArriveReminderLabel')}
                            type="number"
                            component={InputWithLabel}
                            inputComponent={NumberInput}
                            errorMessage={errors.ARRIVE_REMINDER_MIN}
                            min="0"
                            inlineField
                        />
                    </SettingsPanelItem>

                    <SettingsPanelItem type='text'>
                        <Field
                            name="DISPLAY_ETA_DRIFT"
                            label={i18n.t('settings.labels.displayEtaDriftMin')}
                            type="number"
                            component={InputWithLabel}
                            inputComponent={NumberInput}
                            errorMessage={errors.DISPLAY_ETA_DRIFT}
                            min="0"
                            inlineField
                        />
                    </SettingsPanelItem>

                    <SettingsPanelItem type='text'>
                        <Field
                            name="DISPLAY_MAX_ETA_DRIFT"
                            label={i18n.t('settings.labels.displayMaxEtaDriftMin')}
                            type="number"
                            component={InputWithLabel}
                            inputComponent={NumberInput}
                            errorMessage={errors.DISPLAY_MAX_ETA_DRIFT}
                            min="0"
                            inlineField
                        />
                    </SettingsPanelItem>

                    <SettingsPanelItem type='text'>
                        <Field
                            name="ETA_MEDIUM_THRESHOLD"
                            label={i18n.t('settings.labels.displayMediumEta')}
                            type="number"
                            component={InputWithLabel}
                            inputComponent={NumberInput}
                            errorMessage={errors.ETA_MEDIUM_THRESHOLD}
                            min="0"
                            inlineField
                        />
                    </SettingsPanelItem>

                    <SettingsPanelItem type='text'>
                        <Field
                            name="ETA_HIGH_THRESHOLD"
                            label={i18n.t('settings.labels.displayHighEta')}
                            type="number"
                            component={InputWithLabel}
                            inputComponent={NumberInput}
                            errorMessage={errors.ETA_HIGH_THRESHOLD}
                            min="0"
                            inlineField
                        />
                    </SettingsPanelItem>

                    <SettingsPanelItem type='text'>
                        <Field
                            name="OFFER_EXPIRATION_TIME"
                            label={i18n.t('settings.labels.displayOfferExpirationTime')}
                            type="number"
                            component={InputWithLabel}
                            inputComponent={NumberInput}
                            errorMessage={errors.OFFER_EXPIRATION_TIME}
                            min="0"
                            inlineField
                        />
                    </SettingsPanelItem>

                    <SettingsPanelItem type='text'>
                        <Field
                            name="FUTURE_ORDER_MIN_TIME"
                            label={i18n.t('settings.labels.futureOrderMinTime')}
                            type="number"
                            component={InputWithLabel}
                            inputComponent={NumberInput}
                            errorMessage={errors.FUTURE_ORDER_MIN_TIME}
                            min="0"
                            inlineField
                        />
                    </SettingsPanelItem>

                    <SettingsPanelItem type='text'>
                        <Field
                            name="FUTURE_ORDER_MAX_TIME"
                            label={i18n.t('settings.labels.futureOrderMaxTime')}
                            type="number"
                            component={InputWithLabel}
                            inputComponent={NumberInput}
                            errorMessage={errors.FUTURE_ORDER_MAX_TIME}
                            min="0"
                            inlineField
                        />
                    </SettingsPanelItem>

                    <SettingsPanelItem type='text'>
                        <Field
                            name="FUTURE_ORDER_TIME_INTERVAL"
                            label={i18n.t('settings.labels.futureOrderTimeInterval')}
                            type="number"
                            component={InputWithLabel}
                            inputComponent={NumberInput}
                            errorMessage={errors.FUTURE_ORDER_TIME_INTERVAL}
                            min="0"
                            inlineField
                        />
                    </SettingsPanelItem>

                </SettingsPanel>
            </SettingsContainer>
            <SaveSettingsContainer>
                <ApplyButton
                    redButtons={false}
                    disabled={false}
                    type="submit"
                    data-test-id="submitSettings"
                    title={i18n.t('settings.labels.saveButton')}
                    displayLoader={displayLoader}
                />
            </SaveSettingsContainer>
        </Form>
)};

SettingsForm.propTypes = {
    values: PropTypes.shape({}).isRequired,
    errors: PropTypes.shape({}).isRequired,
    setFieldValue: PropTypes.func.isRequired,
    displayLoader: PropTypes.bool.isRequired,
};

export default SettingsForm;
