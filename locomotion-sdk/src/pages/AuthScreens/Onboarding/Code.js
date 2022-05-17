import React, { useState } from "react";
import PinCode from "../../../Components/PinCode";
import OnboardingNavButtons from "./OnboardingNavButtons";
import onboardingContext from '../../../context/onboarding'
import { ErrorText, PageContainer, SafeView } from "./styles";
import i18n from "../../../I18n";
import { useNavigation } from "@react-navigation/native";
import Header from "./Header";
import ScreenText from "./ScreenText";

const Code = () => {
    const {onVert, onboardingState} = onboardingContext.useContainer()
    const [code, setCode] = useState('')
    const [showErrorText, setShowErrorText] = useState(false)
    const onVertCodeChange = (value) => {
        setShowErrorText(false)
        setCode(value)
    }

    const verify = async (v) => {
        setCode(v)
        const response = await onVert(v)
        if (response === 'failed') {
            return setShowErrorText(true)
        }
    }
    return (
        <SafeView>
            <Header title={i18n.t('onboarding.pages.code.title')} />
            <PageContainer>
                <ScreenText 
                    text={i18n.t('onboarding.pages.code.text')} 
                    subText={i18n.t('onboarding.pages.code.subText', {phoneNumber: onboardingState.phoneNumber})} />
                <PinCode
                    onChange={onVertCodeChange}
                    onLastDigit={verify}
                />
                {showErrorText && <ErrorText>{i18n.t('login.vertError')}</ErrorText>}
                <OnboardingNavButtons 
                    isInvalid={showErrorText || code.length < 4} 
                    onFail={() => setShowErrorText(true)} /> 
            </PageContainer>
        </SafeView>
    )
}

export default Code;