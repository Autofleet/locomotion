import React, {
  createContext,
  useState,
  useMemo,
} from 'react';
import * as cancellationReasonsApi from './api';
import { CancellationReason, CancellationReasonsContextInterface } from './interface';

export const CancellationReasonsContext = createContext<CancellationReasonsContextInterface>({
  cancellationReasons: [],
  getCancellationReasons: async (rideId?: string) => undefined,
  clearCancellationReasons: () => undefined,
});

function CancellationReasonsProvider({ children }: { children: any }) {
  const [cancellationReasons, setCancellationReasons] = useState<CancellationReason[]>([]);

  const getCancellationReasons = async (rideId?: string) => {
    if (rideId) {
      const cancellationReasonFromApi = await cancellationReasonsApi.getCancellationReasons(rideId);
      setCancellationReasons(cancellationReasonFromApi);
    }
  };

  const clearCancellationReasons = () => {
    setCancellationReasons([]);
  };

  const contextValue = useMemo(() => ({
    getCancellationReasons,
    cancellationReasons,
    clearCancellationReasons,
  }), [cancellationReasons]);

  return (
    <CancellationReasonsContext.Provider
      value={contextValue}
    >
      {children}
    </CancellationReasonsContext.Provider>
  );
}

export default CancellationReasonsProvider;
