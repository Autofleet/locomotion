import React from 'react';
import styled from 'styled-components';
import propsTypes from 'prop-types';

const SwitchContainer = styled.View`
  border-top-width: 2px;
  border-top-color: #dedede;
  width: 100%;
  flex-direction: row;
  height: 70px;
  justify-content: center;
  padding-top: 20px;
`;

const SwitchText = styled.Text`
  font-size: 18;
  font-weight: 300;
  font-style: normal;
  letter-spacing: -0.4;
  text-align: left;
  color: #5c5c5c;

  /* selected: {
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.4,
    color: '#333333',
  }, */
`;

const Switch = styled.Switch`
  margin-left: auto;
  margin-top: -15px;
`;

const MyRow = ({ onChange, active, text }) => (
  <Switch onTintColor="#23a0fe" tintColor="#dedede" thumbTintColor="#fafafc" onValueChange={onChange} value={active} />
);

export default MyRow;

MyRow.defaultProps = {
  text: '',
  active: false,
  onChange: () => null,
};

MyRow.propTypes = {
  text: propsTypes.string,
  active: propsTypes.bool,
  onChange: propsTypes.func,
};
