import React, { useState } from "react";
import styled from "styled-components";
import PhoneNumberInput from "../../../Components/PhoneNumberInput";
import i18n from "../../../I18n";
import OnboardingNavButtons from "./OnboardingNavButtons";
import onboardingContext from '../../../context/onboarding'
import { ErrorText, SafeView } from "./styles";

const Phone = () => {
    const {onboardingState, setOnboardingState} = onboardingContext.useContainer()
    const [showErrorText, setShowErrorText] = useState(false)
    const onPhoneNumberChange = (phoneNumber) => {
        setShowErrorText(false)
        if (!phoneNumber.valid) {
            return;
          }
          setOnboardingState({
            ...onboardingState,
            phoneNumber: phoneNumber.international,
          });
    }

    const onSubmitPhoneNumber = async () => {
        if (!loginState.phoneNumber) {
          setLoginState({
            error: I18n.t('login.invalidPhoneNumberError'),
          });
          return;
        }
    
        try {
          await loginApi({
            phoneNumber: loginState.phoneNumber,
          });
        } catch (e) {
          console.log('Bad login with response', e);
          setLoginState({
            error: I18n.t('login.phoneNumberError'),
          });
    
          return;
        }
    
        setLoginState({
          loginStep: 'vert',
          error: '',
        });
      };

    return (
        <SafeView>
            <PhoneNumberInput 
                onNumberInput={onPhoneNumberChange}
                placeholder={i18n.t('login.phoneNumberPlaceholder')}
            />
            {showErrorText && <ErrorText>{i18n.t('login.invalidPhoneNumberError')}</ErrorText>}
            <OnboardingNavButtons 
                nextPage="Code" 
                lastPage="Start" 
                isInvalid={!onboardingState.phoneNumber}
                onNext={onSubmitPhoneNumber} 
                onFail={() => setShowErrorText(true)}
            /> 
        </SafeView>
    )
}

export default Phone;