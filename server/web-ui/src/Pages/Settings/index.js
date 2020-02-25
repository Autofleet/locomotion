import {Redirect} from "react-router-dom";
import React, {Fragment} from "react";
import {Body, Content, SettingsContainer } from "./styled";
import Nav from "../Nav";
import {H1} from "../../Common/Header";
import i18n from "../../i18n";
import Toggle from "../../Common/Toggle";
import {ToggleContainer} from "../../popups/AddUser/styled";

export default () => {
    if (!localStorage.token) {
        return <Redirect to="/login"/>;
    }

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
                                value={`toggle_active`}
                                checked={true}
                                onChange={(event) => {
                                    if (event.target.checked) {
                                        // setFieldValue('active', true)
                                    } else {
                                        // setFieldValue('active', false)
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
