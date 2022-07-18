import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { MAIN_ROUTES } from '../../pages/routes';
import SvgIcon from '../SvgIcon';
import { Container, UpcomingText } from './styled';
import calendarIcon from '../../assets/calendar.svg';
import i18n from '../../I18n';
import { FutureRidesContext } from '../../context/futureRides';
import * as NavigationService from '../../services/navigation';

const FutureRidesButton = () => {
  const { futureRides } = useContext(FutureRidesContext);
  const theme = useContext(ThemeContext);
  const text = futureRides.length > 1
    ? i18n.t('home.futureRides.oneUpcomingRide')
    : i18n.t('home.futureRides.multipleUpcomingRides');

  return (
    <Container onPress={() => NavigationService.navigate(MAIN_ROUTES.FUTURE_RIDES)}>
      <SvgIcon
        Svg={calendarIcon}
        height={12}
        width={12}
        fill={theme.primaryColor}
        style={{
          marginRight: 5,
        }}
      />
      <UpcomingText>
        {`${futureRides.length} `}
      </UpcomingText>
      <UpcomingText numberOfLines={1}>
        {text}
      </UpcomingText>
    </Container>
  );
};

export default FutureRidesButton;
