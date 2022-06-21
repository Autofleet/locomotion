import React, {
  useState, useEffect, useRef, createContext, useCallback, useMemo,
} from 'react';

export const BottomSheetContext = createContext();

const BottomSheetProvider = ({ navigation, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sheetState, setSheetState] = useState('collapsed');

  const [snapPointsState, setSnapPointsState] = useState(['CONTENT_HEIGHT', '100%']);
  const [snapPointIndex, setSnapPointIndex] = useState(0);
  const snapPoints = useMemo(() => snapPointsState, []);
  const getSnapPoints = () => useMemo(() => snapPointsState, [snapPointsState]);

  useEffect(() => {
    const newIsExpanded = snapPointIndex === (snapPointsState.length - 1);
    setIsExpanded(newIsExpanded);
  }, [snapPointIndex]);

  return (
    <BottomSheetContext.Provider
      value={{
        snapPoints,
        isExpanded,
        getSnapPoints,
        snapPointIndex,
        setSnapPointIndex,
        sheetState,
        setSheetState,
        setIsExpanded,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetProvider;
