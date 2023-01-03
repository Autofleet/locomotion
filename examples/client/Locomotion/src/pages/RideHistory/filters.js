import moment from 'moment';
import i18n from '../../I18n';
import { startOfDayTime, YYYY_MM_DD, toDate } from './consts';

export const formatDateBeforeSend = date => moment(date).toDate();

export const FILTERS = () => ({
  // quarter: {
  //   id: 'quarter',
  //   title: i18n.t('activityPage.filters.titles.quarter', 'Quarter'),
  //   getParams: () => ({
  //     fromDate: `${moment().subtract(6, 'month').format(YYYY_MM_DD)} ${startOfDayTime}`,
  //     toDate,
  //   }),
  // },
  // month: {
  //   id: 'month',
  //   title: i18n.t('activityPage.filters.titles.month', 'Month'),
  //   getParams: () => ({
  //     fromDate: `${moment().subtract(1, 'month').format(YYYY_MM_DD)} ${startOfDayTime}`,
  //     toDate,
  //   }),
  // },
  today: {
    id: 'today',
    title: i18n.t('rideHistory.filters.titles.today'),
    getParams: () => ({
      fromDate: formatDateBeforeSend(`${moment().format(YYYY_MM_DD)} ${startOfDayTime}`),
      toDate: formatDateBeforeSend(toDate),
    }),
  },
  yesterday: {
    id: 'yesterday',
    title: i18n.t('rideHistory.filters.titles.yesterday'),
    getParams: () => ({
      fromDate: formatDateBeforeSend(`${moment().subtract(1, 'day').format(YYYY_MM_DD)} ${startOfDayTime}`),
      toDate: formatDateBeforeSend(`${moment().format(YYYY_MM_DD)} ${startOfDayTime}`),
    }),
  },
  thisWeek: {
    id: 'thisWeek',
    title: i18n.t('rideHistory.filters.titles.thisWeek'),
    getParams: () => ({
      fromDate: formatDateBeforeSend(`${moment().subtract(1, 'week').format(YYYY_MM_DD)} ${startOfDayTime}`),
      toDate: formatDateBeforeSend(toDate),
    }),
  },
  lastWeek: {
    id: 'lastWeek',
    title: i18n.t('rideHistory.filters.titles.lastWeek'),
    getParams: () => ({
      fromDate: formatDateBeforeSend(`${moment().subtract(2, 'week').format(YYYY_MM_DD)} ${startOfDayTime}`),
      toDate: formatDateBeforeSend(`${moment().subtract(1, 'week').format(YYYY_MM_DD)} ${startOfDayTime}`),
    }),
  },
});
