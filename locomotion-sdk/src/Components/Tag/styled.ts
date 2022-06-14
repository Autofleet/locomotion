import { FONT_SIZES, FONT_WEIGHTS } from "../../context/theme";
import styled from "styled-components/native"

type ContainerProps = {
    theme: any;
}

type TextProps = {
    color: string;
}

export const Container = styled.View<ContainerProps>`
border-radius: 8px;
padding: 2px 8px;
`

export const TagText = styled.Text<TextProps>`
${FONT_SIZES.MEDIUM};
${FONT_WEIGHTS.REGULAR};
color:  ${({color}) => color};
`