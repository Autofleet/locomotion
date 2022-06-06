import { useEffect, useReducer, useCallback } from 'react';
import network from '../Services/network';

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, isError: false };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const useAsyncMethod = (asyncMethod, parser, initialData) => {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  const parserCb = useCallback(parser, []);
  const asyncMethodCb = useCallback(asyncMethod, []);

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const result = await asyncMethodCb();

        if (!didCancel) {
          const payload = (parserCb && parserCb instanceof Function) ? await parserCb(result.data) : result.data;
          dispatch({ type: 'FETCH_SUCCESS', payload });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [asyncMethodCb, parserCb]);

  return state;
};

export default useAsyncMethod;

export const getUsers = () => network.get('/api/v1/admin/users');
