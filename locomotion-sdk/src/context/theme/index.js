import React, { useEffect, useState } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { ThemeProvider, ThemeContext } from 'styled-components';

const DARK_MODE_ENABLED = false;

const FORCE_DARK_MODE = false;

// interface LocomotionTheme {
//   primaryColor: string;
//   secondaryColor: string;
//   textColor: string;
//   dividerColor: string;
//   backgroundColor: string;
// }

export const darkTheme = {
  primaryColor: '',
  secondaryColor: '',
  textColor: '#fff',
  dividerColor: '#4a4c50',
  backgroundColor: '#202023',
};

export const lightTheme = {
  primaryColor: '',
  secondaryColor: '',
  textColor: '#000',
  dividerColor: '#e0e0e0',
  backgroundColor: '#fff',
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
    console.log('colorScheme', { colorScheme });
    setDarkMode(colorScheme === THEME_MOD.DARK);
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
