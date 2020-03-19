import {Redirect} from "react-router-dom";
import React, {Fragment, useEffect, useState} from "react";
import i18n from "../../i18n";
import settingsContainer from "../../contexts/settingsContainer";
import Nav from "../Nav";
import {Body, Content,} from "./styled";
import {H1} from "../../Common/Header";

import Form from './form'
import * as Yup from "yup";
import {Formik} from "formik";
import diff from "object-diff";

const FieldIsRequiredMsg = i18n.t('settings.validation.fieldIsRequired');

Yup.string.prototype.urlHttps = function urlHttps() {
    return this.matches(
        /^((https):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
        , {
        name: 'url',
        message: i18n.t('settings.validation.urlIsInvalid'),
        excludeEmptyString: true
    });
};

export default () => {
    const settings = settingsContainer.useContainer();
    const [displayLoader, setDisplayLoader] = useState(false);
    const [showForm, setShowForm] = useState(false);

    if (!localStorage.token) {
        return <Redirect to="/login"/>;
    }

    useEffect(() => {
        settings.loadSettings();
    }, []);

    useEffect(() => {
        if (settings.settingsList) {
            setShowForm(true);
        }
    }, [settings.settingsList]);

return (
        <Fragment>
            <Body>
                <Nav/>
                <Content>
                    <H1>
                        {i18n.t('settings.settings')}
                    </H1> { showForm &&
                        <Formik
                            validateOnBlur={false}
                            validateOnChange={false}
                            {...{ initialValues: settings.settingsList }}
                            validationSchema={Yup.object().shape({
                                MANUAL_APPROVAL: Yup.boolean(),
                                TERMS_URL: Yup.string().urlHttps().required(FieldIsRequiredMsg),
                                PRIVACY_URL: Yup.string().urlHttps().required(FieldIsRequiredMsg),
                                CONTACT_US_URL: Yup.string().urlHttps().required(FieldIsRequiredMsg),
                                ARRIVE_REMINDER_MIN: Yup.number().required(FieldIsRequiredMsg),
                                DISPLAY_ETA_DRIFT: Yup.number().required(FieldIsRequiredMsg),
                                DISPLAY_MAX_ETA_DRIFT: Yup.number().required(FieldIsRequiredMsg),
                                ETA_MEDIUM_TRESHOLD: Yup.number().required(FieldIsRequiredMsg),
                                ETA_HIGH_TRESHOLD: Yup.number().required(FieldIsRequiredMsg),
                                OFFER_EXPIRATION_TIME: Yup.number().required(FieldIsRequiredMsg),
                            })}
                            onSubmit={async (values, actions) => {
                                actions.setSubmitting(true);
                                setTimeout(() => setDisplayLoader(true), 100);

                                const { ...otherValues } = diff(settings.settingsList, values);
                                try {
                                    Object.keys(otherValues).map(async (key, index) => {
                                        await settings.UpdateSetting(key, otherValues[key]);
                                    });
                                } catch (error) {
                                    console.log(error);
                                }
                                actions.setSubmitting(false);
                                setTimeout(() => setDisplayLoader(false), 1200);
                            }}
                            render={props => (
                                <Form {...props} displayLoader={displayLoader} />
                            )}
                        /> }
                </Content>
            </Body>
        </Fragment>
    );
};
