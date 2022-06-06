import React, { useState } from 'react';
import styled from 'styled-components';
import propsTypes from 'prop-types';
import BasicTable from '..';

const margin = 0;
const Table = styled(BasicTable)`

    &.cards-table.ReactTable .rt-tbody .rt-tr-group {
        margin-bottom: 10px;
        border-radius: 4px;
        background-color: #ffffff;
        box-shadow: 0px 1px 3px 0 rgba(157, 165, 180, 0.42);
        margin-left: 4px;
        margin-right: 4px;
        min-height: 46px;
        font-size: 13px;
    }

    &.cards-table.ReactTable .rt-thead .rt-th, .ReactTable .rt-thead .rt-td {
        box-shadow: none;
        border-right: 0;
        border-left: 0;
        opacity: 0.5;
        font-size: 10px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        /* line-height: 6; */
        letter-spacing: 0.2px;
        text-align: left;
        color: rgba(92, 92, 92, 0.5);
    }

    &.cards-table.ReactTable .rt-tbody .rt-td {
        border-right: 0;
    }

    &.cards-table.ReactTable .rt-thead.-header {
        box-shadow: unset;
    }

    &.cards-table.ReactTable {
        border: 0;
        width: 100%;
    }

    &.cards-table div.rt-td { align-self: center; }

    &.cards-table div.pagination-bottom {
        padding-right: 15px;
        padding-left: 15px;
    }
`;

const StripTable = (props) => {
  const [expanded, setExpanded] = useState({});
  const drillDownSettings = (props.SubComponent) ? ({
    onSortedChange: () => {
      setExpanded({});
    },

    getTrProps: (state, rowInfo) => ({
      onClick: () => {
        setExpanded({
          ...expanded,
          [rowInfo.viewIndex]: !expanded[rowInfo.viewIndex],
        });
      },
      style: {
        minHeight: 40,
        cursor: 'pointer',
      },
    }),

    getTrGroupProps: (state, rowInfo) => {
      let style = {};
      if (rowInfo && expanded[rowInfo.viewIndex - 1]) {
        style = {
          ...style,
          borderTop: '1px solid rgba(157, 165, 180, 0.42)',
        };
      }
      if (rowInfo && expanded[rowInfo.viewIndex]) {
        style = {
          ...style,
          marginRight: `${margin - 15}px`,
          marginLeft: `${margin - 15}px`,
          boxShadow: '0px 0px 3px 0 rgba(157, 165, 180, 0.42)',
          marginTop: '15px',
          marginBottom: '15px',
          paddingBottom: 0,
        };
      }

      return {
        style,
      };
    },

  }) : {};

  return (
    <Table
      expanded={expanded}
      getTheadProps={() => ({
        style: {
          marginRight: `${margin}px`,
          marginLeft: `${margin}px`,
        },
      })}
      {...drillDownSettings}
      {...props}
    />
  );
};

export default StripTable;

StripTable.defaultProps = {
  SubComponent: undefined,
};

StripTable.propTypes = {
  SubComponent: propsTypes.node,
};
