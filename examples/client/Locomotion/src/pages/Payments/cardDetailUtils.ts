export const capitalizeFirstLetter = (string: string) => string?.charAt(0).toUpperCase() + string?.slice(1);
export const getLastFourForamtted = (lastFour: string) => `**** ${capitalizeFirstLetter(lastFour)}`;
