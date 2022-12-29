import React, {
  createContext,
  useState,
} from 'react';
import * as cancellationReasonsApi from './api';
import { CancellationReason, CancellationReasonsContextInterface } from './interface';


export const CancellationReasonsContext = createContext<CancellationReasonsContextInterface>({
  cancellationReasons: [],
  getCancellationReasons: async (rideId?: string) => undefined,
  clearCancellationReasons: () => undefined,
});

const CancellationReasonsProvider = ({ children }: { children: any }) => {
  const [cancellationReasons, setCancellationReasons] = useState<CancellationReason[]>([]);

  const getCancellationReasons = async (rideId?: string) => {
    console.log('getCancellationReasons', rideId);
    if (rideId) {
      const cancellationReasonFromApi = await cancellationReasonsApi.getCancellationReasons(rideId);
      setCancellationReasons(cancellationReasonFromApi);
    }
  };

  const clearCancellationReasons = () => {
    setCancellationReasons([]);
  };

  return (
    <CancellationReasonsContext.Provider
      value={{
        getCancellationReasons,
        cancellationReasons,
        clearCancellationReasons,
      }}
    >
      {children}
    </CancellationReasonsContext.Provider>
  );
};

export default CancellationReasonsProvider;
