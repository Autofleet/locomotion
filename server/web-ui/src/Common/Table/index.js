import React from 'react';
import propsTypes from 'prop-types';
import { Table } from './styled';

const MyTable = props => (
  <Table
    minRows={0}
    defaultPageSize={props.data.length}
    pageSize={props.data.length}
    showPagination={false}
    {...props}
    className={`${props.theme} ${props.className}`}
  />
);

export default MyTable;

MyTable.defaultProps = {
  data: [],
  className: '',
  theme: 'cards-table',
};

MyTable.propTypes = {
  data: propsTypes.arrayOf(propsTypes.shape({})),
  className: propsTypes.string,
  theme: propsTypes.string,
};
