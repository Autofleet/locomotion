import React, { useState } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import networkService from '../Services/network';
import logoSrc from '../assets/logo.png';
import Input from '../Common/Input';
import Button from '../Common/Button';
import LoaderButton from '../Common/LoaderButton'

const LoginContainer = styled.div`
  display: block;
  width: 100%;
  height: 100vs;
  background-color: #f6f6f8;
`;

const Content = styled.div`
  position: absolute;
  width: 500px;
  height: 450px;
  left: calc(50% - 250px);
  top: calc(50% - 200px);
  box-shadow: rgba(51, 70, 85, 0.3) 0px 15px 29px 0px;
  background: rgb(255, 255, 255) none repeat scroll 0% 0%;
  border-radius: 4px;
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
`;

const Logo = styled.img.attrs({ src: logoSrc })`
  min-width: 100px;
  max-width: 400px;
  max-height: 120px;
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
  display: block;
  justify-content: center;
`;

const Submit = styled(LoaderButton)`
  width: 50%;
  margin: 22px auto 0 auto;
  display: block;
`;

const Error = styled.div`
  margin: 5px auto;
  transform: translate(0, 24px);
  display: block;
  width: 80%;
  font-size: .75rem;
  color: #f03a5f;
  text-align: center;
`;



export default ({ children }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const login = async (userName, password) => {
    setLoginError(null)
    setIsLoading(true)
    try {
      const {data:loginResult} = await networkService.post('/api/v1/admin/auth', { userName, password });
      if (loginResult && loginResult.token) {
        const token = loginResult.token;
        localStorage.token = token;
        networkService.setToken(token);
      } else {
        setLoginError('Wrong username or password')
      }
    } catch (e) {
      console.log('error');
      setLoginError('Network Error')
    }
    setIsLoading(false)
  };

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
              onChange={event => setUserName(event.target.value)}
            />
          </InputAndLabel>
          <InputAndLabel>
            <Label>Password:</Label>
            <PasswordInput
              withBorder
              withHover
              type='password'
              onChange={event => setPassword(event.target.value)}
            />
          </InputAndLabel>
          <SubmitContainer>
            <Submit
              title="Login"
              displayLoader={isLoading}
              darkLoader={false}
              onClick={async (event) => {
                await login(userName, password);
              }}
              disabled={isLoading}
            />
          </SubmitContainer>
          {loginError ?
            <Error>
              {loginError}
            </Error>
          : null}
        </Content>
      </LoginContainer>
  );
};

