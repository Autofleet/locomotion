import { useNavigation } from "@react-navigation/native";
import React from "react";
import i18n from "../../../../I18n";
import OnboardingNavButtons from "../OnboardingNavButtons";
import { LogoContainer, WelcomeSubText, WelcomeText, Logo, PageContainer, TextContainer } from "./styles";
import logoSrc from '../../../../assets/logo.png';
import onboardingContext from '../../../../context/onboarding';
import { SafeView } from "../styles";


const Welcome = () => {
    const {onboardingState} = onboardingContext.useContainer()
    const navigation = useNavigation()
    return (
        <SafeView>
        <PageContainer>
            <LogoContainer>
                <Logo source={logoSrc} />
            </LogoContainer>
            <TextContainer>
                <WelcomeText>
                    {i18n.t('onboarding.pages.welcome.text', {firstName: onboardingState.firstName})}
                </WelcomeText>
                <WelcomeSubText>
                    {i18n.t('onboarding.pages.welcome.subText')}
                </WelcomeSubText>
            </TextContainer>
            <OnboardingNavButtons buttonText={i18n.t('onboarding.pages.welcome.buttonText')} onNext={() => navigation.navigate('MainApp')} />
        </PageContainer>
        </SafeView>
    )
}

export default Welcome;