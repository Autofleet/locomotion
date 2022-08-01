import React, {
  useContext, useRef,
} from 'react';
import propTypes from 'prop-types';
import {
  FilterBarContainer, FilterTouchableOpacity, FilterView, FilterText,
} from './styled';
import { rideHistoryContext } from '../../../context/rideHistory';

const TaskFilterBar = ({ filter, activeFilter }) => {
  const active = filter.id === activeFilter;
  return (
    <FilterView elevation={2} active={active} key={filter.id}>
      <FilterText active={active}>{filter.title}</FilterText>
    </FilterView>
  );
};

const FilterBar = React.memo(({
  filters, activeFilter, onFilterClicked,
}) => {
  const { savedFilterScrollPos, saveFilterScrollPos } = useContext(rideHistoryContext);
  const scrollView = useRef();

  const saveScrollPos = ({ nativeEvent: { contentOffset: { x } } }) => {
    saveFilterScrollPos(x);
  };

  const onContentSizeChange = () => {
    if (scrollView.current && savedFilterScrollPos) {
      scrollView.current.scrollTo({ x: savedFilterScrollPos, animated: true });
    }
    scrollView.current.flashScrollIndicators();
  };
  return (
    <FilterBarContainer
      testID="filter-bar-container"
      ref={(ref) => {
        scrollView.current = ref;
      }}
      onScrollEndDrag={e => saveScrollPos(e)}
      onContentSizeChange={onContentSizeChange}
    >
      {Object.values(filters).map(filter => (
        <FilterTouchableOpacity
          noLoader
          noBackground
          onPress={() => !filter.isCustomFilter && onFilterClicked(filter.id)}
          key={`FilterTouchableOpacity#${filter.id}`}
          testID={`FilterTouchableOpacity-${filter.id}`}
        >
          <TaskFilterBar filter={filter} activeFilter={activeFilter} />
        </FilterTouchableOpacity>
      ))}
    </FilterBarContainer>
  );
});

export default FilterBar;

FilterBar.propTypes = {
  onFilterClicked: propTypes.func,
  activeFilter: propTypes.string,
  filters: propTypes.shape({}),
};

FilterBar.defaultProps = {
  onFilterClicked: () => null,
  activeFilter: undefined,
  filters: {},
};
