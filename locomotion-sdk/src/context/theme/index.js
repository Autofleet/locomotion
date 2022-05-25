import React, { useEffect, useState } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { ThemeProvider, ThemeContext } from 'styled-components';

// const DARK_MODE_ENABLED = false;
//
const FORCE_DARK_MODE = false;

const DARK_MODE_ENABLED = true;

// const FORCE_DARK_MODE = true;

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
  primaryButtonTextColor: '#fff',
  disabledColor: '#bcbcbc',

  textColor: '#fff',
  pageBackgroundColor: '#24292E',
};

export const lightTheme = {
  primaryColor: '#38a7fc',
  // primaryColor: '#f00',
  secondaryColor: '#08902d',
  primaryButtonTextColor: '#fff',
  disabledColor: '#bcbcbc',

  /** for dark mode: */
  textColor: '#000',
  pageBackgroundColor: '#fff',
};

export const THEME_MOD = {
  LIGHT: 'light',
  DARK: 'dark',
};

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
