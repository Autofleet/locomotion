import { useNavigation } from "@react-navigation/native";
import React from "react";
import i18n from "../../../../I18n";
import { ButtonsContainer, ButtonText, NavButton } from "./styles";


const OnboardingNavButtons = ({lastPage, nextPage, isInvalid, onFail, onNext}) => {
    const navigation = useNavigation()

    const nextScreen = () => {
        if (isInvalid) {
            onFail()
        } else {
            onNext()
            navigation.navigate(nextPage)
        }
    }
    return (
        <ButtonsContainer>
            <NavButton data-test-id='OnboardingBackButton' onPress={() => navigation.navigate(lastPage)}>
                <ButtonText>{i18n.t('general.back')}</ButtonText>
            </NavButton>
            <NavButton data-test-id='OnboardingNextButton' onPress={isInvalid ? onFail : () => navigation.navigate(nextPage)}>
                <ButtonText>{i18n.t('general.next')}</ButtonText>
            </NavButton>
        </ButtonsContainer>
    )
}

export default OnboardingNavButtons;