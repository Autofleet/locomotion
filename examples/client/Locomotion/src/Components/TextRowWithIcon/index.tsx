import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, Context as ThemeContext } from '../../context/theme';
import SvgIcon from '../SvgIcon';

const Container = styled(View)`
display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: center;
border: 1px solid #f1f2f6;
padding: 15px;
border-radius: 8px;
margin: 5px 0;
`;

const BasicText = styled(Text)`
${FONT_SIZES.LARGE};
color: #333333;
`;

interface TextRowWithIconProps {
    text: string;
    icon?: any;
    style?: Record<string, unknown>;
}

const TextRowWithIcon = ({ text, icon, style }: TextRowWithIconProps) => {
  const theme = useContext(ThemeContext);
  return (
    <Container style={style}>
      {icon && (
      <SvgIcon
        Svg={icon}
        width={15}
        height={15}
        fill={theme.primaryColor}
        style={{ marginRight: 10 }}
      />
      )}
      <BasicText>
        {text}
      </BasicText>
    </Container>
  );
};

TextRowWithIcon.defaultProps = {
  icon: null,
  style: {},
};

export default TextRowWithIcon;
