import React from 'react';
import styled from 'styled-components';
import propsTypes from 'prop-types';

const Switch = styled.Switch`
  margin-left: auto;
  margin-top: -15px;
`;

function MyRow({ onChange = () => null, active = false }) {
  return <Switch onTintColor="#23a0fe" tintColor="#dedede" thumbTintColor="#fafafc" onValueChange={onChange} value={active} />;
}

export default MyRow;

MyRow.propTypes = {
  text: propsTypes.string,
  active: propsTypes.bool,
  onChange: propsTypes.func,
};
