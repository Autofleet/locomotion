import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import styled from 'styled-components';
import { Row, Rows } from 'react-native-table-component';

const tableMarginFromSides = '20';

export const TableContainer = styled.ScrollView(`
    flex: 1;
    backgroundColor: '#fff';
`);

export const StyledHeaderRow = styled(Row)`
    height: 40;
    borderBottomWidth: 0;
    margin: 0 ${tableMarginFromSides}px;
`;

export const StyledRows = styled(Rows)`
    border-bottom-width: 1;
    border-bottom-color: rgba(0,0,0,0.07);
    margin: 5px ${tableMarginFromSides}px;
    padding-bottom: 10px;
`;

export const textStyle = StyleSheet.create({
    header: {
        color: '#A6A6A6',
        fontSize: 12,
    },
    row: {
        color: '#5F5F5F',
        fontSize: 12,
    }
});




