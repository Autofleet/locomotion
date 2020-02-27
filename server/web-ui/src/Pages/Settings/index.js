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
        if (settings.settingsObj) {
            setShowForm(true);
        }
    }, [settings.settingsObj]);

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
                            {...{ initialValues: settings.settingsObj }}
                            validationSchema={Yup.object().shape({
                                MANUAL_APPROVAL: Yup.boolean(),
                                TERMS_URL: Yup.string().url('Url invalid').required('Field requierd'),
                                PRIVACY_URL: Yup.string().url('Url invalid').required('Field requierd'),
                                CONTACT_US_URL: Yup.string().url('Url invalid').required('Field requierd')
                            })}
                            onSubmit={async (values, actions) => {
                                actions.setSubmitting(true);
                                setTimeout(() => setDisplayLoader(true), 100);

                                const { ...otherValues } = diff(settings.settingsObj, values);
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
