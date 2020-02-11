import React, { useState } from 'react';
import styled from 'styled-components';
import BasicTable from '../';

const margin = 15;
const Table = styled(BasicTable)`
    &.cards-table.ReactTable .rt-tbody .rt-tr-group {
        margin-bottom: 0px;
        border-radius: 0px;
        box-shadow: none;
        border: 1px solid rgba(157, 165, 180, 0.42);
        border-top: 0;
        transition: all 0.2s, border-top 0s;
        margin-right: ${margin}px;
        margin-left: ${margin}px;
        &:first-child {
          border-top: 1px solid rgba(157, 165, 180, 0.42);
        }

        background: linear-gradient(180deg, rgba(46,46,46,1) 0%, rgba(33,33,33,1) 100%);
    }

    &.cards-table.ReactTable .rt-thead .rt-th, .ReactTable .rt-thead .rt-td {
        box-shadow: none;
        border-right: 0;
        border-left: 0;
        opacity: 0.5;
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        /* line-height: 6; */
        letter-spacing: 0.2px;
        text-align: left;
        color: #b9bbbe;
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

    &.cards-table.ReactTable .rt-expander {
      &:after {
        border-top: 7px solid rgb(255, 255, 255);
      }
    }
`;

const StripTable = (props) => {
  const [expanded, setExpanded] = useState({});
  return (
    <Table
      expanded={expanded}
      onSortedChange={() => {
        setExpanded({});
      }}
      getTrProps={(state, rowInfo) => ({
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
      })}
      getTrGroupProps={(state, rowInfo) => {
        let style = {};
        if (rowInfo && (expanded[rowInfo.viewIndex] || expanded[rowInfo.viewIndex - 1])) {
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
          };
        }

        return {
          style,
        };
      }}
      getTheadProps={() => ({
        style: {
          marginRight: `${margin}px`,
          marginLeft: `${margin}px`,
        },
      })}
      {...props}
    />
  );
};


export default StripTable;
