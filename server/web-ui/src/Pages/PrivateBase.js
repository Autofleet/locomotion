import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import networkService from '../Services/network';
import logoSrc from '../assets/logo2.png';
import Input from '../Common/Input';
import Button from '../Common/Button';

const Content = styled.div`
`;

const PrivateContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const LoginPopup = styled.div`
  min-width: 400px; 
  min-height: 280px;
`;


const Header = styled.header`
  text-align: center;
`;

const Logo = styled.img.attrs({ src: logoSrc })`
  width: 200px;
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
    window.location.reload();
  } else {
    return {state: 'Error', message: 'can`t log in'};
  }
};

export default ({ children }) => {
  let [userName, password] = useState('');

  return (
    <PrivateContainer>
      <Modal
        isOpen={!localStorage.token}
        style={{
          overlay: {
            position: 'fixed',
            backgroundColor: 'rgba(227, 227, 227, 1)',
            zIndex: 100,
          },
          content: {
            position: 'fixed',
            top: '50%',
            right: 'auto',
            bottom: 'auto',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            outline: '0',
          }
        }}
        contentLabel="Example Modal"
      >
        <LoginPopup>
          <Header><Logo/>
            <Title>
              Enter Your login details
            </Title></Header>
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
          <SubmitContainer><Submit
            onClick={async (event) => {
              await login(userName, password);
              event.preventDefault();
            }}
          > Login </Submit></SubmitContainer>
        </LoginPopup>
      </Modal>
      <Content>
        {children}
      </Content>
    </PrivateContainer>
  );
};
