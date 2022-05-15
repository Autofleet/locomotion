import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "../../../Components/TextInput";
import OnboardingNavButtons from "./OnboardingNavButtons";
import onboardingContext from '../../../context/onboarding'
import { ErrorText, SafeView } from "./styles";
import i18n from "../../../I18n";

const FullNameContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const Name = () => {
    const {onboardingState, setOnboardingState} = onboardingContext.useContainer()
    const [showErrorText, setShowErrorText] = useState(false)

    const inputChange = field => value => {
        setShowErrorText(false)
        setOnboardingState({
        ...onboardingState,
        [field]: value,
      });
    }

    
    return (
        <SafeView>
            <FullNameContainer>
                <TextInput
                placeholder={i18n.t('onboarding.firstNamePlaceholder')}
                width="40%"
                onChangeText={inputChange('firstName')}
                value={onboardingState.firstName}
                autoCapitalize="words"
                />
                <TextInput
                placeholder={i18n.t('onboarding.lastNamePlaceholder')}
                width="40%"
                onChangeText={inputChange('lastName')}
                value={onboardingState.lastName}
                autoCapitalize="words"
                />
            </FullNameContainer>
            {showErrorText && <ErrorText>{i18n.t('onboarding.fullNameError')}</ErrorText>}
            <OnboardingNavButtons 
                nextPage="Email" 
                lastPage="Code" 
                isInvalid={!onboardingState.firstName || !onboardingState.lastName}
                onFail={() => setShowErrorText(true)}
                /> 
        </SafeView>
    )
}

export default Name;