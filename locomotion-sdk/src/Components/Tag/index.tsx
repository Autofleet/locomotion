import React from "react";
import { Container, TagText } from "./styled";

const Tag = ({ text, containerStyles, textColor}: 
    { text: string; containerStyles: {}; textColor: string;}) => {
    return (
        <Container style={containerStyles}>
            <TagText color={textColor}>
                {text}
            </TagText>
        </Container>
    )
}

export default Tag;