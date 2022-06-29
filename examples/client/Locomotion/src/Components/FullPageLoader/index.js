import React from 'react';
import styled from 'styled-components';
import LottieView from 'lottie-react-native';
import darkLoader from '../../assets/loaders/dark-loader.json';

const FullPageLoaderWrapper = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.pageBackgroundColor};
  position: absolute;
  z-index: 99999;
`;
const LoaderContainer = styled.View`
    align-self: center;
    position: absolute;
    top: 50%;
    margin-top: -8px;
`;
const FullPageLoader = props => (
  <FullPageLoaderWrapper>
    <LoaderContainer>
      <LottieView
        style={{
          width: 15,
          height: 15,
        }}
        source={darkLoader}
        autoPlay
        loop
        {...props}
      />
    </LoaderContainer>
  </FullPageLoaderWrapper>
);
export default FullPageLoader;
