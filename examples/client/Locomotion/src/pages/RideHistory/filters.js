import moment from 'moment';
import i18n from '../../I18n';
import { startOfDayTime, YYYY_MM_DD, toDate } from './consts';

export const FILTERS = {
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
    title: i18n.t('rideHistory.filters.titles.today', 'Today'),
    getParams: () => ({
      fromDate: `${moment().format(YYYY_MM_DD)} ${startOfDayTime}`,
      toDate,
    }),
  },
  yesterday: {
    id: 'yesterday',
    title: i18n.t('rideHistory.filters.titles.yesterday', 'Yesterday'),
    getParams: () => ({
      fromDate: `${moment().subtract(1, 'day').format(YYYY_MM_DD)} ${startOfDayTime}`,
      toDate: `${moment().format(YYYY_MM_DD)} ${startOfDayTime}`,
    }),
  },
  thisWeek: {
    id: 'thisWeek',
    title: i18n.t('rideHistory.filters.titles.thisWeek', 'This week'),
    getParams: () => ({
      fromDate: `${moment().subtract(1, 'week').format(YYYY_MM_DD)} ${startOfDayTime}`,
      toDate,
    }),
  },
  lastWeek: {
    id: 'lastWeek',
    title: i18n.t('rideHistory.filters.titles.lastWeek', 'Last week'),
    getParams: () => ({
      fromDate: `${moment().subtract(2, 'week').format(YYYY_MM_DD)} ${startOfDayTime}`,
      toDate: `${moment().subtract(1, 'week').format(YYYY_MM_DD)} ${startOfDayTime}`,
    }),
  },
};
