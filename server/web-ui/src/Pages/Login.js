import React, { useState } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import networkService from '../Services/network';
import logoSrc from '../assets/mod-logo.png';
import Input from '../Common/Input';
import Button from '../Common/Button';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: fixed;
  background-color: rgba(227, 227, 227, 1);
  z-index: 100;
  bottom: 0px;
  box-sizing: border-box;
  font-family: "Montserrat", sans-serif;
  left: 0px;
  line-height: normal;
  right: 0;
  top: 0;
`;

const Content = styled.div`
  position: fixed;
  inset: 50% auto auto 50%;
  border: 1px solid rgb(204, 204, 204);
  background: rgb(255, 255, 255) none repeat scroll 0% 0%;
  overflow: auto;
  border-radius: 4px;
  outline: currentcolor none 0px;
  padding: 20px;
  transform: translate(-50%, -50%);
  min-width: 500px;
`;

const Header = styled.header`
  text-align: center;
`;

const Logo = styled.img.attrs({ src: logoSrc })`
  width: 120px;
  margin-left: 15px;
`;

const Title = styled.h1`
  color: #2e3136;
`;

const InputAndLabel = styled.label`
  display: block;
  padding-top: 15px;
`;

const Label = styled.label`
`;

const PasswordInput = styled(Input)`
`;

const SubmitContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Submit = styled(Button)`
  width: 50%;
`;

const Error = styled.div`
  display: block;
  margin: 15px auto;
  width: 200px;
  text-align: center;
`;

const login = async (userName, password) => {
  console.log(userName, password);
  const loginResult = await networkService.post('api/v1/admin/auth', { userName, password });
  if (loginResult) {
    localStorage.token = loginResult.data.token;
    window.location.replace("/");
  } else {
    return {state: 'Error', message: 'can`t log in'};
  }
};

export default ({ children }) => {
  let [userName, password] = useState('');

  return localStorage.token ? <Redirect to="/"/> : (
      <LoginContainer>
        <Content>
          <Header>
            <Logo/>
          </Header>
          <InputAndLabel>
            <Label>Username:</Label>
            <Input
              withBorder
              withHover
              onChange={event => userName = event.target.value}
            />
          </InputAndLabel>
          <InputAndLabel>
            <Label>Password:</Label>
            <PasswordInput
              withBorder
              withHover
              type='password'
              onChange={event => password = event.target.value}
            />
          </InputAndLabel>
          <SubmitContainer>
            <Submit
            onClick={async (event) => {
              await login(userName, password);
              event.preventDefault();
            }}>Login</Submit>
          </SubmitContainer>
        </Content>
      </LoginContainer>
  );
};

