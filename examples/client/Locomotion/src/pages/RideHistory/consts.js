import moment from 'moment';

export const startOfDayTime = '00:00:00';

export const endOfDayTime = '23:59:59';

export const YYYY_MM_DD = 'yyyy-MM-DD';

export const DD_MMMM_YYYY = 'DD MMMM yyyy';

export const MMMM_DD_YYYY = 'MMMM DD, yyyy';

export const toDate = `${moment().format(YYYY_MM_DD)} ${endOfDayTime}`;
