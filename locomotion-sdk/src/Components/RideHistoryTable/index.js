import React from 'react';
import { ScrollView } from 'react-native';
import { Table } from 'react-native-table-component';
import moment from 'moment';
import propsTypes from 'prop-types';
import i18n from '../../I18n';
import { TableContainer, StyledHeaderRow, StyledRows, textStyle } from './styled';

const RideHistoryTable = ({ data }) => {
  const getCreatedAt = date => {
    const Date = moment(date).format('DD-MM-YYYY');
    const Time = moment(date).format('HH:MM');
    return `${Date}\n${Time}`;
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
      <ScrollView>
        <Table>
          <StyledHeaderRow
              data={viewData.tableHead}
              textStyle={textStyle.header}
          />
          <StyledRows
              data={viewData.tableData}
              textStyle={textStyle.row}
          />
        </Table>
      </ScrollView>
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
