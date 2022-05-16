import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import PageHeader from "../../../Components/PageHeader";
import backArrow from '../../../assets/arrow-back.png'
const Header = ({title}) => {
    const navigation = useNavigation()
    const route = useRoute()
    console.log(navigation.getParent().getId(), route.name)
    const canGoBack = navigation.getParent().getId() !== 'authStack' || route.name === 'Phone';
    return (
        <PageHeader 
            title={title} 
            icon={backArrow} 
            onIconPress={navigation.goBack} 
            iconSide='left'
            displayIcon={navigation.canGoBack()}
            />
    )
}

export default Header;