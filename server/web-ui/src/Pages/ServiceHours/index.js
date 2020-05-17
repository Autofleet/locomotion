import React, { Fragment, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import i18n from '../../i18n';
import Nav from '../Nav';
import { H1 } from '../../Common/Header';
import Table from '../../Common/Table/themes/strips';
import Toggle from '../../Common/Toggle';
import Popup from '../../Common/Popup'
import { generateAvatarById } from '../../Services/avatar';
import {Body, Content ,Buttons, ApplyButton, Avatar, SvgBase, avatarSize} from './styled';
import serviceHoursContainer from '../../contexts/serviceHoursContainer';
import { ReactComponent as deleteIcon } from '../../assets/delete.svg'
import { ReactComponent as editIcon } from '../../assets/edit.svg'
import SvgIcon from '../../Common/SvgIcon'

const daysOfWeek = [
  i18n.t('serviceHours.weekDays.sunday'),
  i18n.t('serviceHours.weekDays.monday'),
  i18n.t('serviceHours.weekDays.tuesday'),
  i18n.t('serviceHours.weekDays.wednesday'),
  i18n.t('serviceHours.weekDays.thursday'),
  i18n.t('serviceHours.weekDays.friday'),
  i18n.t('serviceHours.weekDays.saturday')
]

const makeColumns = () => [
  {
    Header: i18n.t('serviceHours.dayInWeek'),
    accessor: 'dayInWeek',
    Cell: ({value: dayInWeek}) => daysOfWeek[dayInWeek]
  },
  { accessor: 'startTime', Header: i18n.t('serviceHours.startTime'), width: 150 },
  { accessor: 'endTime', Header: i18n.t('serviceHours.endTime')},
  { accessor: 'timezone', Header: i18n.t('serviceHours.timezone')}
];

export default () => {
  if (!localStorage.token) {
    return <Redirect to="/login"/>;
  }

  const [popupState, setPopupState] = useState('');
  const [chosenUser, setChosenUser] = useState('');

  const workingHours = serviceHoursContainer.useContainer();

  const columns = [...makeColumns(), {
      Header: '',
      id: 'buttons',
      minWidth: 90,
      accessor: ({ id }) => ({ id }),
      Cell: ({ value: { id } }) => ( // eslint-disable-line react/prop-types
        <Buttons>
          <SvgIcon
            svg={deleteIcon}
            onClick={() => {
                workingHours.deleteSlot(id)
            }}
          />
        </Buttons>
      )
    }]
    useEffect(() => {
      workingHours.loadServiceHours();
    }, []);

    return (
      <Fragment>
      <Body>
        <Nav/>
        <Content>
          <H1>
            {i18n.t('serviceHours.title')}
          </H1>
          <ApplyButton
              redButtons={false}
              disabled={false}
              type="submit"
              data-test-id="submitSettings"
              title={i18n.t('serviceHours.addTimeSlotButton')}
              displayLoader={false}
              onClick={() => setPopupState('AddTimeSlot')}
            />
          <Table
            columns={columns}
            data={workingHours.slotsMap}
          />
        </Content>
        <Popup
          name="AddTimeSlot"
          isVisible={popupState === 'AddTimeSlot'}
          onClose={() => setPopupState(false)}
          popupName={popupState}
          initialValues={{}}
        />

      </Body>


    </Fragment>
    );
};
