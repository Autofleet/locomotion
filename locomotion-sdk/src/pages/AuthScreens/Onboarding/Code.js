import React, { useState } from "react";
import PinCode from "../../../Components/PinCode";
import OnboardingNavButtons from "./OnboardingNavButtons";
import onboardingContext from '../../../context/onboarding'
import { ErrorText, SafeView } from "./styles";
import i18n from "../../../I18n";
import { useNavigation } from "@react-navigation/native";

const Code = () => {
    const {onVert} = onboardingContext.useContainer()
    const navigation = useNavigation()
    const [code, setCode] = useState('')
    const [showErrorText, setShowErrorText] = useState(false)
    const onVertCodeChange = (value) => {
        setShowErrorText(false)
        setCode(value)
    }

    const verify = () => {
        const response = onVert(code)
        if (!response) {
            setShowErrorText(true)
        } else {
            navigation.navigate('Name')
        }
    }
    return (
        <SafeView>
            <PinCode
                onChange={onVertCodeChange}
                onLastDigit={verify}
            />
            {showErrorText && <ErrorText>{i18n.t('login.vertError')}</ErrorText>}
            <OnboardingNavButtons 
                nextPage="Name" 
                lastPage="Phone" 
                isInvalid={showErrorText || code.length < 4} 
                onFail={() => setShowErrorText(true)} /> 
        </SafeView>
    )
}

export default Code;