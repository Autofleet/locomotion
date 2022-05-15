import { useNavigation } from "@react-navigation/native";
import React from "react";
import i18n from "../../../../I18n";
import { ButtonText, NavButton } from "./styles";


const OnboardingNavButtons = ({isInvalid, onFail, onNext}) => {

    const nextScreen = async () => {
        if (isInvalid) {
            onFail()
        } else {
            await onNext()
        }
    }
    return (
            <NavButton data-test-id='OnboardingNextButton' onPress={nextScreen}>
                <ButtonText>{i18n.t('general.next')}</ButtonText>
            </NavButton>
    )
}

export default OnboardingNavButtons;