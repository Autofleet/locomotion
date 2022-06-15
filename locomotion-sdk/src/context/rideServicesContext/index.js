import React, {
    createContext,
  } from 'react';
import { serviceOptions } from './mockServiceEstimations';
  
  export const RideServicesContext = createContext({
    getServiceEstimations: () => serviceOptions
  });
  
  const RideServicesContextProvider = ({ navigation, children }) => {
    const getServiceEstimations = () => {
      return serviceOptions
    }
  
  
    return (
      <RideServicesContext.Provider
        value={{
          getServiceEstimations
        }}
      >
        {children}
      </RideServicesContext.Provider>
    );
  };
  
  export default RideServicesContextProvider;

  