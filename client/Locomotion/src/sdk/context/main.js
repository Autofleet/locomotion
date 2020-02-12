import React, { createContext, useContext, useReducer } from 'react';

import AppSettings from '../services/app-settings';

export const StateContext = createContext();
export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);
export const useStateValue = () => useContext(StateContext);


export const MainProvider = ({ children,LoginPage }) => {
  const initialState = null;

  const saveState = async (state) => {
    try {
      await AppSettings.update(state);
    } catch (e) {
      console.error('Got error while try to save state', e);
    }
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'saveState':
        const newState = {
          ...state,
          ...action.payload,
        };
        console.log('saveState', newState);
        saveState(newState);
        return newState;

      case 'changeState':
        return {
          ...state,
          ...action.payload,
        };

      default:
        return state;
    }
  };


  return (
    <StateProvider initialState={initialState} reducer={reducer}>{children}</StateProvider>
  );
};

const getPopupKey = key => `popup_${key}`;

export const getTogglePopupsState = () => {
  const [state, dispatch] = useContext(StateContext);

  return [id => state && (state[getPopupKey(id)] || false), (id, open) => dispatch({
    type: 'changeState',
    payload: {
      [getPopupKey(id)]: open,
    },
  })];
};
