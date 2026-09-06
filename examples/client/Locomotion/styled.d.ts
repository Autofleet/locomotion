import 'styled-components/native';

interface AppTheme {
  isDarkMode: boolean;
  primaryColor: string;
  secondaryColor: string;
  primaryButtonTextColor: string;
  disabledColor: string;
  errorColor: string;
  textColor: string;
  pageBackgroundColor: string;
  borderRadiusValues: {
    NONE: number;
    XS: number;
    SM: number;
    MD: number;
    LG: number;
    XL: number;
    '2XL': number;
  };
  useVehicleColor: () => { vehicleColor: any };
}

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}

declare module 'styled-components/native' {
  export interface DefaultTheme extends AppTheme {}
}
