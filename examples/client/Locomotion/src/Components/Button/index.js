import React from 'react';
import styled from 'styled-components';
import Loader from '../Loader';
import Mixpanel from '../../services/Mixpanel';

const Container = styled.TouchableOpacity`
  ${({ noBackground, theme }) => (!noBackground ? `background-color: ${theme.primaryColor};` : '')}
  ${({ disabled }) => (disabled ? 'opacity: 0.5;' : '')}
`;

const LoaderContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const Button = props => (
  <Container
    {...props}
    onPress={(e) => { /* eslint-disable-line consistent-return */
      if (!props.disabled) {
        if (props.onPress) {
          Mixpanel.trackElementClick(props);
          return props.onPress(e);
        }
      }
    }}
  >
    {props.isLoading ? (
      <LoaderContainer>
        <Loader
          lottieViewStyle={{
            height: 15, width: 15,
          }}
        />
      </LoaderContainer>
    ) : props.children}
  </Container>
);


export default Button;
