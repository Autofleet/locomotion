import styled from 'styled-components';
import i18n from '../i18n';
import afLogoSrc from '../assets/af-logo.png';
import React from 'react';

const PoweredByLink = styled.a`
  color: #b9bbbe;
  text-decoration: unset;
  cursor: pointer;
  font-size: 10px;
`;

const AfLogo = styled.img.attrs({ src: afLogoSrc })`
  height: 13px;
`;

export default (({className}) => (
  <div className={className}>
    <PoweredByLink target="_blank" href="https://autofleet.io/">{i18n.t('navigation.poweredBy')} <AfLogo/></PoweredByLink>
  </div>
));
