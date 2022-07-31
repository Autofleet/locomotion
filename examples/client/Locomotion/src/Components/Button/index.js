import React, { useState } from 'react';
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

const Button = (props) => {
  const [isLoadingInternal, setIsLoadingInternal] = useState(false);

  return (
    <Container
      {...props}
      activeOpacity={props.onPress ? 0.5 : 1}
      onPress={async (e) => {
        if (!props.disabled) {
          if (props.onPress) {
            setIsLoadingInternal(true);
            Mixpanel.trackElementClick(props);
            await props.onPress(e);
            setIsLoadingInternal(false);
          }
        }
      }}
    >
      {!props.noLoader && (props.isLoading || isLoadingInternal) ? (
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
};


export default Button;
