import React from 'react';
import styled from 'styled-components';
import Mixpanel from '../../services/Mixpanel';

const Container = styled.TouchableOpacity`
  ${({ noBg, theme }) => (!noBg ? `background-color: ${theme.buttonBackgroundColor};` : '')}
`;

const Button = props => (
  <Container
    {...props}
    onPress={(e) => { /* eslint-disable-line consistent-return */
      if (props.onPress) {
        Mixpanel.trackElementClick(props);
        return props.onPress(e);
      }
    }}
  >
    {props.children}
  </Container>
);


export default Button;
