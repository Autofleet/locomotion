import { I18nManager } from 'react-native';

export const Start = () => (I18nManager.isRTL ? 'right' : 'left');
export const StartCapital = () => (I18nManager.isRTL ? 'right' : 'left');

export const End = () => (I18nManager.isRTL ? 'left' : 'right');
export const EndCapital = () => (I18nManager.isRTL ? 'left' : 'right');
