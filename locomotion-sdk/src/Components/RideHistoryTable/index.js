import React from 'react';
import { Table } from 'react-native-table-component';
import moment from 'moment';
import propsTypes from 'prop-types';
import i18n from '../../I18n';
import {
  TableContainer, StyledHeaderRow, StyledRows, textStyle,
} from './styled';

const rowsFlexWidth = [2, 2, 2, 1];

const RideHistoryTable = ({ data }) => {
  const getCreatedAt = (tripTime) => {
    const date = moment.utc(tripTime).format('DD-MM-YYYY');
    const time = moment.utc(tripTime).format('HH:mm');
    return `${date}\n${time}`;
  };

  const formatDataToView = data => Object.keys(data).map(elm => ([
    getCreatedAt(data[elm].createdAt),
    data[elm].pickupAddress,
    data[elm].dropoffAddress,
    '',
  ]));

  const viewData = {
    tableHead: [
      i18n.t('rideHistory.ridesTable.timeTitle'),
      i18n.t('rideHistory.ridesTable.startTitle'),
      i18n.t('rideHistory.ridesTable.stopTitle'),
      i18n.t('rideHistory.ridesTable.price'),
    ],
    tableData: formatDataToView(data),
  };

  return (
    <TableContainer>
      <Table>
        <StyledHeaderRow
          data={viewData.tableHead}
          textStyle={textStyle.header}
          flexArr={rowsFlexWidth}
        />
        <StyledRows
          data={viewData.tableData}
          textStyle={textStyle.row}
          flexArr={rowsFlexWidth}
        />
      </Table>
    </TableContainer>
  );
};

export default RideHistoryTable;

RideHistoryTable.defaultProps = {
  data: [],
};

RideHistoryTable.propTypes = {
  data: propsTypes.array,
};
