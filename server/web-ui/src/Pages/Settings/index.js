import {Redirect} from "react-router-dom";
import React, {Fragment, useEffect} from "react";
import {Body, Content, SettingsContainer } from "./styled";
import Nav from "../Nav";
import {H1} from "../../Common/Header";
import i18n from "../../i18n";
import Toggle from "../../Common/Toggle";
import {ToggleContainer} from "../../popups/AddUser/styled";
import settingsContainer from "../../contexts/settingsContainer";

export default () => {
    if (!localStorage.token) {
        return <Redirect to="/login"/>;
    }
    const settings = settingsContainer.useContainer();

    useEffect(() => {
        settings.loadSettings();
    }, []);

    return (
        <Fragment>
            <Body>
                <Nav/>
                <Content>
                    <H1>
                        {i18n.t('settings.settings')}
                    </H1>
                    <SettingsContainer>
                        <ToggleContainer>
                            <Toggle
                                labelText={i18n.t('settings.activateUsersLabel')}
                                value={`toggle_MANUAL_APPROVAL`}
                                checked={settings.getSettingByKey('MANUAL_APPROVAL')}
                                onChange={(event) => {
                                    if (event.target.checked) {
                                        settings.UpdateSetting('MANUAL_APPROVAL',{value: true});
                                    } else {
                                        settings.UpdateSetting('MANUAL_APPROVAL',{value: false});
                                    }
                                }}
                            />
                        </ToggleContainer>
                    </SettingsContainer>
                </Content>
            </Body>
        </Fragment>
    );
};
