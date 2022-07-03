import React, { createContext, useEffect, useState } from 'react';
import moment from 'moment';
import network from '../../services/network';
import Mixpanel from '../../services/Mixpanel';
import i18n from '../../I18n';
import StorageService from '../../services/storage';
import { formatSps } from '../../lib/ride/utils';
// import mock from './mock';

export const PAGE_SIZE = 10;

const PERSIST_LIMIT = 100;

const TTL_MILLI = 30000;

export const rideHistoryContext = createContext({});

const fetchRides = async ({
  savedFromDate,
  savedToDate,
  pageNumber,
  pageSize,
  ...params
}: any) => {
  const { data } = await network.get('/api/v1/me/rides', {
    params: {
      fromDate: savedFromDate,
      toDate: savedToDate,
      pageNumber,
      pageSize,
      ...(params || {}),
      orderBy: 'createdAt',
      sort: 'DESC',
    },
  });
  return data;
};
// }: any) => mock;
const formatFloatTime = (num: number) => Math.round(num);

const isValid = (time: number) => Date.now() < (time + TTL_MILLI);

const getDuration = (stopPoints: Array<any>) => {
  const duration = moment
    .duration(moment(stopPoints[stopPoints.length - 1].completedAt)
      .diff(moment(stopPoints[0].completedAt)));

  const asMinutes = formatFloatTime(duration.asMinutes());
  if (duration.get('hours') > 0) {
    const asHours = duration.asHours().toFixed(1);
    return [
      i18n.t('rideHistory.ridesDurationHours', { ridesDurationHours: asHours }),
      asHours,
      asMinutes];
  } if (duration.get('minutes') > 0) {
    return [
      i18n.t('rideHistory.ridesDurationMinutes', { ridesDurationMinutes: asMinutes }),
      null,
      asMinutes,
    ];
  }
  return [
    i18n.t('rideHistory.fewSeconds', 'Few seconds'),
    null,
    0,
  ];
};


const formatRides = (data: any) => data.map((r: any) => {
  const sortedSps = formatSps(r.stopPoints);
  const [appDuration, appDurationHours, appDurationMinutes] = getDuration(sortedSps);
  return ({
    ...r,
    stopPoints: sortedSps,
    appDuration,
    appDurationHours,
    appDurationMinutes,
  });
});

export const RideHistoryContextProvider = ({ children }: any) => {
  const [rides, setRides] = useState<any>(null);
  const [savedParams, setSavedParams] = useState<any | null>(null);
  const [savedFilterScrollPos, saveFilterScrollPos] = useState<any | null>(null);

  const persist = async (ridesToPersist: any, savedParamsToPersist: any) => {
    if (ridesToPersist.length < PERSIST_LIMIT) {
      await StorageService.save({
        rideHistoryContext: {
          rides: ridesToPersist,
          savedParams: savedParamsToPersist,
          time: Date.now(),
        },
      });
    }
  };

  const restore = async () => {
    const { rideHistoryContext: restored } = await StorageService.get(['rideHistoryContext']);
    if (restored) {
      const { rides: restoredRides, savedParams: restoredSavedParams, time } = restored;
      if (isValid(time)) {
        await setRides(restoredRides);
        await setSavedParams(restoredSavedParams);
      }
    }
  };

  const loadRidesAndSaveParams = async ({
    filterId,
    fromDate,
    toDate,
    pageNumber,
    pageSize,
    moreRides,
  }: any) => {
    let data: any = [];
    const newParams = {
      filterId,
      fromDate,
      toDate,
      pageNumber,
      pageSize,
    };
    try {
      await setSavedParams(newParams);
      if (!fromDate) {
        throw new Error('no fromDate');
      }
      data = await fetchRides({
        fromDate,
        toDate,
        pageNumber,
        pageSize,
      });
      data = formatRides(data);
    } catch (e) {
      Mixpanel.setEvent('Error loading more rides');
    }
    await persist(moreRides ? [...rides, ...data] : data, newParams);
    await setRides(moreRides ? (oldRides: any) => [...oldRides, ...data] : data);
    return data;
  };

  const initRides = async ({
    initFilterId,
    fromDate,
    toDate,
  }: any = {}) => (
    savedParams
      ? rides
      : loadRidesAndSaveParams({
        filterId: initFilterId,
        fromDate,
        toDate,
        pageNumber: 0,
        pageSize: PAGE_SIZE,
      }));

  const loadRides = ({
    filterId,
    fromDate,
    toDate,
    pageNumber = 0,
    pageSize = PAGE_SIZE,
  }: any = {}) => loadRidesAndSaveParams({
    filterId,
    fromDate,
    toDate,
    pageNumber,
    pageSize,
  });

  const loadMoreRides = () => {
    const {
      filterId,
      fromDate,
      toDate,
      pageNumber,
      pageSize,
    } = savedParams;
    if (rides.length === (pageNumber + 1) * pageSize) {
      return loadRidesAndSaveParams({
        filterId,
        fromDate,
        toDate,
        pageNumber: pageNumber + 1,
        pageSize,
        moreRides: true,
      });
    }
    return false;
  };

  useEffect(() => {
    restore();
  }, []);

  return (
    <rideHistoryContext.Provider
      value={{
        rides,
        initRides,
        loadRides,
        savedParams,
        loadMoreRides,
        savedFilterScrollPos,
        saveFilterScrollPos: (pos: any) => saveFilterScrollPos(pos),
      }}
    >
      {children}
    </rideHistoryContext.Provider>
  );
};
