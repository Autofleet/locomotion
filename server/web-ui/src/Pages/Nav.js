import React from 'react';
import styled from 'styled-components';
import logoSrc from '../assets/logo.png';
import afLogoSrc from '../assets/af-logo.png';
import {
  NavLink
} from "react-router-dom";

export const navWidthPx = 280;

const NavContainer = styled.div`
  width: ${navWidthPx}px;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
`;

const Menu = styled.div``;

const MenuItem = styled(NavLink).attrs({ activeClassName: 'active' })`
  border-radius: 4px;
  display: block;
  font-size: 16px;
  margin-bottom: 6px;
  padding: 8px 16px;
  color: rgb(172, 172, 172);
  transition: background .125s,color .125s;
  text-decoration: unset;
  cursor: pointer;
  &.active {
    background-color: rgb(36, 167, 233);
    color: #fff;
  }
`;

const Header = styled.a`
  border-radius: 4px;
  display: block;
  font-size: 16px;
  margin-top: 30px;
  margin-bottom: 6px;
  padding: 8px 16px;
  color: #b9bbbe;
  opacity: 0.8;
  transition: background .125s,color .125s;
  text-decoration: unset;
  font-size: 14px;
`;

const ExternalLink = styled.a`
  border-radius: 4px;
  display: block;
  font-size: 16px;
  margin-bottom: 6px;
  padding: 8px 16px;
  color: #b9bbbe;
  transition: background .125s,color .125s;
  text-decoration: unset;
  cursor: pointer;
`;

const PoweredByLink = styled(ExternalLink)`
  position: fixed;
  bottom: 10px;
  margin: auto 0 0 1em;
  font-size: 10px;
`;

const Logo = styled.img.attrs({ src: logoSrc })`
  width: 200px;
  margin-left: 15px;
`;

const AfLogo = styled.img.attrs({ src: afLogoSrc })`
  height: 13px;
`;

export default () => (
  <NavContainer>
    <Logo />
    <Menu>
      <Header></Header>
      <MenuItem exact to="/">
        Users
      </MenuItem>
      <ExternalLink onClick={() => { localStorage.removeItem('token'); window.location.reload() }}>Logout</ExternalLink>
    </Menu>
    <PoweredByLink target="_blank" href="https://autofleet.io/">powered by <AfLogo/></PoweredByLink>
  </NavContainer>
)

