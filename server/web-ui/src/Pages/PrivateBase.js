import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import networkService from '../Services/network';
import Nav from './Nav';
import logoSrc from '../assets/logo2.png';

const Body = styled.div`
  flex: 1;
  padding: 0 50px;
  overflow: auto;
  height: 100vh;
`;

const PrivateContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const LoginPopup = styled.div`
  min-width: 600px;
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

const Input = styled.input`
  display: block;
  border: solid 1px #9c9c9c;
  font-size: 22px;
  resize: none;
  width: 50%;
  border-radius: 1px;
  text-align: center;
  font-size: 18px;
`;

const PasswordInput = styled(Input)`
`;

const Submit = styled.button`
  resize: none;
  padding: 10px 25px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 2px;
  text-align: center;
  font-size: 18px;
  background: ${({ disabled }) => !disabled ? 'rgb(4, 158, 243)' : '#b9bbbe'};
  color: #fff;
  border: none;
  margin-top: 15px;
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
                backgroundColor: 'rgba(0, 0, 0, 1)',
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
                  onChange={event => userName = event.target.value }
                />
              </InputAndLabel>
              <InputAndLabel>
                <Label>Password:</Label>
                <PasswordInput
                  type='password'
                  onChange={event => password = event.target.value }
                />
              </InputAndLabel>
              <Submit
                onClick={async (event) => {
                  await login(userName, password);
                  event.preventDefault();
                } }
              > Login </Submit>
            </LoginPopup>
      </Modal>
      <Nav />
      <Body>
        {children}
      </Body>
    </PrivateContainer>
  )
};
