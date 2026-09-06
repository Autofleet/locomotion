import React from 'react';
import styled from 'styled-components/native';
import propsTypes from 'prop-types';

const Switch = styled.Switch`
  margin-left: auto;
  margin-top: -15px;
`;

const MyRow = (props) => {
  const { onChange = () => null, active = false } = props;
  return (
    <Switch onTintColor="#23a0fe" tintColor="#dedede" thumbTintColor="#fafafc" onValueChange={onChange} value={active} />
  );
};

export default MyRow;

MyRow.propTypes = {
  text: propsTypes.string,
  active: propsTypes.bool,
  onChange: propsTypes.func,
};
