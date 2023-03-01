/* eslint-disable import/prefer-default-export */
import network from '../../services/network';
import { CancellationReason } from './interface';

export const getCancellationReasons = async (rideId: string): Promise<CancellationReason[]> => {
  const { data } = await network.get(`/api/v1/rides/${rideId}/cancellation-reasons`);
  return data;
};
