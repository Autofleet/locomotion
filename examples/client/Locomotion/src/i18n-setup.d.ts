import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
    returnObjects: false;
  }
  // Override TFunctionResult so i18n.t() always returns string
  export type TFunctionResult = string;
}
