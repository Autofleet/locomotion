import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import styled from 'styled-components';
import {Row, Rows} from 'react-native-table-component';

const tableMarginFromSides = '20';

export const TableContainer = styled(ScrollView)`
  flex: 1;
`;

export const StyledHeaderRow = styled(Row)`
  height: 40px;
  border-bottom-width: 0;
  margin: 0 ${tableMarginFromSides}px;
`;

export const StyledRows = styled(Rows)`
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.07);
  margin: 5px ${tableMarginFromSides}px;
  padding-bottom: 10px;
`;

export const textStyled = theme =>
  StyleSheet.create({
    header: {
      color: theme.textColor,
      fontSize: 12,
    },
    row: {
      color: theme.textColor,
      fontSize: 12,
    },
  });
