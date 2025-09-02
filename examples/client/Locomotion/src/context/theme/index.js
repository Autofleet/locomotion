import React, { useEffect, useState } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { ThemeProvider, ThemeContext } from 'styled-components';
import Config from 'react-native-config';
import settings from '../settings';
import SETTINGS_KEYS from '../settings/keys';

const {
  FORCE_DARK_MODE = false,
  DARK_MODE_ENABLED = false,
  PRIMARY_COLOR = undefined,
  SECONDARY_COLOR = undefined,
} = Config;

export const getTextColorForTheme = () => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark' ? '#ffffff' : '#000000';
};

export const convertHextToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b},${alpha}`;
};

export const ERROR_COLOR = '#f35657';

export const darkTheme = {
  primaryColor: '#38a7fc',
  secondaryColor: '#08902d',
  primaryButtonTextColor: '#ffffff',
  disabledColor: '#bcbcbc',
  errorColor: ERROR_COLOR,

  textColor: '#ffffff',
  pageBackgroundColor: '#24292E',
};

export const lightTheme = {
  primaryColor: PRIMARY_COLOR || '#38a7fc',
  // primaryColor: '#f00',
  secondaryColor: SECONDARY_COLOR || '#08902d',
  primaryButtonTextColor: '#ffffff',
  disabledColor: '#bcbcbc',
  errorColor: ERROR_COLOR,

  /** for dark mode: */
  textColor: '#000000',
  pageBackgroundColor: '#ffffff',
};

export const THEME_MOD = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const GREEN_COLOR = '#2cc36a';
export const LINK_BLUE_COLOR = '#38a7fc';
export const FONT_SIZES = {
  H1: 'font-size: 22px',
  H2: 'font-size: 18px',
  H3: 'font-size: 16px',
  LARGE: 'font-size: 14px',
  MEDIUM: 'font-size: 12px',
  SMALL: 'font-size: 10px',
};

export const FONT_SIZES_VALUES = {
  H1: 22,
  H2: 18,
  H3: 16,
  LARGE: 14,
  MEDIUM: 12,
  SMALL: 10,
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
  SEMI_REGULAR: `
    font-family: 'Inter-Regular';
    font-weight: 500;
  `,
};

const BORDER_RADIUS_VALUES = {
  NONE: 0,
  XS: 2,
  SM: 4,
  MD: 6,
  LG: 8,
  XL: 16,
  '2XL': 24,
};

/**
 * useVehicleColor hook
 * Once called, it'll get the vehicle color setting and update vehicleColor, asynchronously
 * @return vehicleColor
 */
const useVehicleColor = () => {
  const { getSettingByKey } = settings.useContainer();
  const [vehicleColor, setVehicleColor] = useState(null);

  const getVehicleColor = async () => {
    const color = await getSettingByKey(
      SETTINGS_KEYS.VEHICLE_COLOR,
    );
    setVehicleColor(color);
  };

  useEffect(() => {
    getVehicleColor();
  }, []);

  return { vehicleColor };
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
        borderRadiusValues: BORDER_RADIUS_VALUES,
        ...(isDarkMode ? darkTheme : lightTheme),
        useVehicleColor,
      }}
    >
      {children}
    </ThemeProvider>
  );
};

export const Context = ThemeContext;

export default Provider;
