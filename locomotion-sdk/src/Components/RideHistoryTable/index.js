import React from 'react';
import { Table } from 'react-native-table-component';
import moment from 'moment';
import propsTypes from 'prop-types';
import i18n from '../../I18n';
import { TableContainer, StyledHeaderRow, StyledRows, textStyle } from './styled';

const rowsFlexWidth = [2, 3, 3];

const RideHistoryTable = ({ data }) => {
  const getCreatedAt = data => {
    const date = moment(data).format('DD-MM-YYYY');
    const time = moment(data).format('HH:MM');
    return `${date}\n${time}`;
  };

  const formatDataToView = function (data) {
    return Object.keys(data).map(elm => ([
      getCreatedAt(data[elm].createdAt),
      data[elm].pickupAddress,
      data[elm].dropoffAddress,
    ]));
  };

  const viewData = {
    tableHead: [ i18n.t('rideHistory.tableTimeTitle'), i18n.t('rideHistory.tableStartTitle'), i18n.t('rideHistory.tableStopTitle') ],
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
