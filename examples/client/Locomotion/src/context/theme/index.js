import React, { useEffect, useState } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { ThemeProvider, ThemeContext } from 'styled-components';
import Config from 'react-native-config';

const {
  FORCE_DARK_MODE = false,
  DARK_MODE_ENABLED = false,
  PRIMARY_COLOR = undefined,
  SECONDARY_COLOR = undefined,
} = Config;

// interface LocomotionTheme {
//   primaryColor: string;
//   secondaryColor: string;
//   textColor: string;
//   dividerColor: string;
//   backgroundColor: string;
// }

export const darkTheme = {
  primaryColor: '#38a7fc',
  secondaryColor: '#08902d',
  primaryButtonTextColor: '#ffffff',
  disabledColor: '#bcbcbc',

  textColor: '#ffffff',
  pageBackgroundColor: '#24292E',
};

export const lightTheme = {
  primaryColor: PRIMARY_COLOR || '#38a7fc',
  // primaryColor: '#f00',
  secondaryColor: SECONDARY_COLOR || '#08902d',
  primaryButtonTextColor: '#ffffff',
  disabledColor: '#bcbcbc',

  /** for dark mode: */
  textColor: '#000000',
  pageBackgroundColor: '#ffffff',
};

export const THEME_MOD = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const ERROR_COLOR = '#f35657';

export const FONT_SIZES = {
  H1: 'font-size: 22px',
  H2: 'font-size: 18px',
  H3: 'font-size: 16px',
  LARGE: 'font-size: 14px',
  MEDIUM: 'font-size: 12px',
  SMALL: 'font-size: 10px',
};

export const FONT_WEIGHTS = {
  BOLD: `
    font-weight: bold;
    font-family: 'Inter-Bold';
  `,
  SEMI_BOLD: `
    font-weight: 600;
    font-family: 'Inter-SemiBold';
  `,
  MEDIUM: `
    font-weight: 600;
    font-family: 'Inter-Medium';
  `,
  REGULAR: `
    font-family: 'Inter-Regular';
    font-weight: normal;
  `,
  LIGHT: `
    font-family: 'Inter-Light';
    font-weight: normal;
  `,
};

// export const TEXT_STYLE_OBJECT = {
//   H1_BOLD: FONT_WEIGHT.BOLD.concat(FONT_SIZES.H1),
//   H1_SEMI_BOLD: FONT_WEIGHT.SEMI_BOLD.concat(FONT_SIZES.H1),
//   H2_SEMI_BOLD: FONT_WEIGHT.SEMI_BOLD.concat(FONT_SIZES.H2),
//   H2_REGULAR: FONT_WEIGHT.REGULAR.concat(FONT_SIZES.H2),
//   H3_SEMI_BOLD: FONT_WEIGHT.SEMI_BOLD.concat(FONT_SIZES.H3),
//   H3_REGULAR: FONT_WEIGHT.REGULAR.concat(FONT_SIZES.H3),
//   LARGE_REGULAR: FONT_WEIGHT.REGULAR.concat(FONT_SIZES.LARGE),
//   LARGE_SEMI_BOLD: FONT_WEIGHT.SEMI_BOLD.concat(FONT_SIZES.LARGE),
//   LARGE_MEDIUM: FONT_WEIGHT.MEDIUM.concat(FONT_SIZES.LARGE),
//   MEDIUM_REGULAR: FONT_WEIGHT.REGULAR.concat(FONT_SIZES.MEDIUM),
//   MEDIUM_MEDIUM: FONT_WEIGHT.MEDIUM.concat(FONT_SIZES.MEDIUM),
//   MEDIUM_LIGHT: FONT_WEIGHT.LIGHT.concat(FONT_SIZES.MEDIUM),
//   MEDIUM_BOLD: FONT_WEIGHT.BOLD.concat(FONT_SIZES.MEDIUM),
//   SMALL_REGULAR: FONT_WEIGHT.SEMI_BOLD.concat(FONT_SIZES.SMALL),
//   SMALL_LIGHT: FONT_WEIGHT.LIGHT.concat(FONT_SIZES.SMALL),
// }


const Provider = ({ children }) => {
  const colorScheme = useColorScheme();
  const isInitDarkMode = FORCE_DARK_MODE || (Appearance.getColorScheme() === THEME_MOD.DARK && DARK_MODE_ENABLED);
  const [isDarkMode, setDarkMode] = useState(isInitDarkMode);
  // Appearance.addChangeListener()
  useEffect(() => {
    if (!FORCE_DARK_MODE && DARK_MODE_ENABLED) {
      setDarkMode(colorScheme === THEME_MOD.DARK);
    }
  }, [colorScheme]);

  return (
    <ThemeProvider
      theme={{
        isDarkMode,
        ...(isDarkMode ? darkTheme : lightTheme),
      }}
    >
      {children}
    </ThemeProvider>
  );
};

export const Context = ThemeContext;

export default Provider;
