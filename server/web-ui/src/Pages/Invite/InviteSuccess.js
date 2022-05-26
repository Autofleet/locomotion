import React from "react";
import SvgIcon from "../../Common/SvgIcon";
import { ReactComponent as editIcon } from '../../assets/edit.svg';
import { ButtonText, Container, ContinueButton, Icon, SuccessCard, SuccessText, Title } from "./styles";
import i18n from "../../i18n";

const InviteSuccess = () => {
    return (
        <Container>
            <SuccessCard>
            <SvgIcon
                svg={editIcon}
                />
                <Title>{i18n.t('invites.success.title')}</Title>
                <SuccessText>{i18n.t('invites.success.text')}</SuccessText>
                <ContinueButton>
                    <ButtonText>
                    {i18n.t('invites.success.buttonText')}
                    </ButtonText>
                </ContinueButton>
            </SuccessCard>
        </Container>
    )
}

export default InviteSuccess;