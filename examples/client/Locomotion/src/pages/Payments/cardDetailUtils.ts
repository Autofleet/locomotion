export const capitalizeFirstLetter = (string: string) => string?.charAt(0).toUpperCase() + string?.slice(1);
export const getLastFourForamttedShort = (lastFour: string) => `**** ${capitalizeFirstLetter(lastFour)}`;
export const getLastFourForamttedShortLong = (lastFour: string) => `**** **** **** ${capitalizeFirstLetter(lastFour)}`;
