import React from 'react';
import PropTypes from 'prop-types';

import OriginalPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import styled from 'styled-components';

const borderStyles = `
  border-radius: 4px;
  border: solid 1px #dedede;
`;

const hoverStyles = `
  background-color: #ffffff;
  &:hover, &:focus, &:active, &.isActive {
    background-color: #ffffff;
  }
`;

export default ({
    Component,
  }) => (
      <Component width={16} height={16} />
  )