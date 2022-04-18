import React from 'react';
import propsTypes from 'prop-types';

import Lottie from 'react-lottie';

import * as animationData from './loader.json';
import * as darkAnimationData from './dark-loader.json';


const options = isDark => ({
  loop: true,
  autoplay: true,
  animationData: (isDark ? darkAnimationData : animationData.default),
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
});

const Loader = ({ isDark, ...props }) => (
  <Lottie
    options={options(props.isDark)}
    height={15}
    width={52}
    {...props}
  />
);

Loader.defaultProps = {
  isDark: false,
};

Loader.propTypes = {
  isDark: propsTypes.bool,
};

export default Loader;
