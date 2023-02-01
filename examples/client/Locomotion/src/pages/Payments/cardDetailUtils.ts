export const capitalizeFirstLetter = (string: string) => string?.charAt(0).toUpperCase() + string?.slice(1);
export const getLastFourFormattedShort = (lastFour: string) => `**** ${capitalizeFirstLetter(lastFour)}`;
export const getLastFourFormattedLong = (lastFour: string) => `**** **** **** ${capitalizeFirstLetter(lastFour)}`;
