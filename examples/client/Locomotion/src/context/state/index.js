import React, {createContext, useContext, useReducer} from 'react';

export const StateContext = createContext();
export const StateProvider = ({reducer, initialState, children}) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);
export const useStateValue = () => useContext(StateContext);

const getPopupKey = key => `popup_${key}`;

export const getTogglePopupsState = () => {
  const [state, dispatch] = useContext(StateContext);

  return [
    id => state && (state[getPopupKey(id)] || false),
    (id, open) =>
      dispatch({
        type: 'changeState',
        payload: {
          [getPopupKey('ridePopupsStatus')]: open,
          [getPopupKey(id)]: open,
        },
      }),
  ];
};
