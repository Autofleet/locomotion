import React, {
  useState, useEffect, useRef, createContext, useCallback, useMemo,
} from 'react';

export const BottomSheetContext = createContext();

const BottomSheetProvider = ({ navigation, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [snapPointsState, setSnapPointsState] = useState(['25%', '100%']);
  const [snapPointIndex, setSnapPointIndex] = useState(0);
  const snapPoints = useMemo(() => snapPointsState, [snapPointsState]);

  useEffect(() => {
    const newIsExpanded = snapPointIndex === (snapPointsState.length - 1);
    setIsExpanded(newIsExpanded);
  }, [snapPointIndex]);

  return (
    <BottomSheetContext.Provider
      value={{
        snapPoints,
        isExpanded,
        snapPointIndex,
        setSnapPointIndex,
        setIsExpanded,
        setSnapPointsState,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetProvider;
