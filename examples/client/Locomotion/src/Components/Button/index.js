import React from 'react';
import styled from 'styled-components';
import Loader from '../Loader';
import Mixpanel from '../../services/Mixpanel';

const Container = styled.TouchableOpacity`
  ${({ noBackground, theme }) => (!noBackground ? `background-color: ${theme.primaryColor};` : '')}
`;

const LoaderContainer = styled.View`
height: 70%;
width: 100%;
margin: auto 0;
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
    {props.isLoading ? (
      <LoaderContainer>
        <Loader lottieViewStyle={{
          height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center',
        }}
        />
      </LoaderContainer>
    ) : props.children}
  </Container>
);


export default Button;
