import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import styled, { ThemeContext } from 'styled-components';
import BusinessAccountText from '../BusinessAccountText';
import { FONT_SIZES } from '../../context/theme';
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
    Image?: any
    iconWidth?: number;
    iconHeight?: number;

}

const TextRowWithIcon = ({
  subTitle, text, icon, style, Image, iconWidth, iconHeight,
}: TextRowWithIconProps) => {
  const theme = useContext(ThemeContext);
  const getImage = () => {
    if (icon) {
      return (
        <SvgIcon
          Svg={icon}
          width={iconWidth}
          height={iconHeight}
          fill={theme.primaryColor}
        />
      );
    }
    if (Image) {
      return <Image />;
    }
  };
  return (
    <Container style={style}>
      {getImage()}
      <BasicText style={{
        ...((Image || icon) && { marginLeft: 10 }),
      }}
      >
        {subTitle ? (
          <BusinessAccountText
            title={text}
            subTitle={subTitle}
          />
        )
          : text}
      </BasicText>
    </Container>
  );
};

TextRowWithIcon.defaultProps = {
  icon: null,
  style: {},
  Image: null,
  iconWidth: 15,
  iconHeight: 15,
};

export default TextRowWithIcon;
