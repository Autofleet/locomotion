import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SvgIcon from "../../Common/SvgIcon";
import { ReactComponent as editIcon } from '../../assets/edit.svg';
import { ReactComponent as closeIcon } from '../../assets/delete.svg';
import { ButtonText, Container, ContinueButton, Card, Text, Title, TextContain } from "./styles";
import i18n from "../../i18n";

const InvitePage = () => {
    const [link, setLink] = useState(null)
    const location = useLocation();
    const success = true || location.state && location.state.isSuccessful
    const pageData = {
        icon: success ? editIcon : closeIcon,
        title: i18n.t(`invites.${success ? 'success' : 'fail'}.title`),
        text: i18n.t(`invites.${success ? 'success' : 'fail'}.text`),
        buttonText: i18n.t(`invites.${success ? 'success' : 'fail'}.buttonText`),
    }
    const getLinkToApp = () => {
        // TODO get operation link from operation using location.state.operationId
        setLink('locomotion://')
    }

    useEffect(() => {
        getLinkToApp()
    }, [])

    return (
        <>
        {link && <Container>
            <Card>
            <SvgIcon
                svg={pageData.icon}
                />
                <TextContain>
                    <Title>{pageData.title}</Title>
                    <Text>{pageData.text}</Text>
                </TextContain>
                {success && <ContinueButton href={link}>
                    <ButtonText>
                    {pageData.buttonText}
                    </ButtonText>
                </ContinueButton>}
            </Card>
        </Container>}
        </>
    )
}

export default InvitePage;