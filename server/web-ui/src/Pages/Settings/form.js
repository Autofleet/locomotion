import React from "react";
import styled from 'styled-components';
import {
    SettingsPanel,
    SettingsPanelHeader,
    SettingsPanelItem,
    ToggleLabelText,
    ApplyButton,
    SettingsContainer,
} from "./styled";
import PropTypes from 'prop-types';
import { Field, FieldArray, Form } from 'formik';
import i18n from '../../i18n';
import Toggle from '../../Common/Toggle';
import InputWithLabel from "../../Common/InputWithLabel";
import {RightSidePopupForm} from "../../popups/AddUser/styled";

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
                        <ToggleLabelText>{i18n.t('settings.activateUsersLabel')}</ToggleLabelText>
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
                            label={i18n.t('settings.termsUrlLabel')}
                            type="text"
                            errorMessage={errors.TERMS_URL}
                            component={InputWithLabel}
                        />
                    </SettingsPanelItem>

                    <SettingsPanelItem type='text'>
                        <Field
                            name="PRIVACY_URL"
                            label={i18n.t('settings.PrivacyUrlLabel')}
                            type="text"
                            errorMessage={errors.PRIVACY_URL}
                            component={InputWithLabel}
                        />
                    </SettingsPanelItem>

                    <SettingsPanelItem type='text'>
                        <Field
                            name="CONTACT_US_URL"
                            label={i18n.t('settings.ContactUsUrlLabel')}
                            type="text"
                            errorMessage={errors.CONTACT_US_URL}
                            component={InputWithLabel}
                        />
                    </SettingsPanelItem>

                    <SettingsPanelItem type='submit'>
                        <ApplyButton
                            redButtons={false}
                            disabled={false}
                            type="submit"
                            data-test-id="submitSettings"
                            title={i18n.t('settings.saveButton')}
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
