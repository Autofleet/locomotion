import React from 'react';
import styled from 'styled-components';
import i18n from '../i18n';
import logoSrc from '../assets/logo.png';
import {
  NavLink
} from "react-router-dom";
import PoweredByBase from '../Common/PoweredBy';

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

const Logo = styled.img.attrs({ src: logoSrc })`
  width: 200px;
  margin-left: 15px;
`;

const PoweredBy = styled(PoweredByBase)`
  padding: 8px 16px;
  position: fixed;
  bottom: 10px;
  margin: auto 0 0 1em;
`;

export default () => (
  <NavContainer>
    <Logo />
    <Menu>
      <Header/>
      <MenuItem exact to="/">{i18n.t('navigation.users')}</MenuItem>
      <MenuItem exact to="/settings">{i18n.t('navigation.settings')}</MenuItem>
      <MenuItem exact to="/service-hours">Service Hours</MenuItem>
      <ExternalLink onClick={() => { localStorage.removeItem('token'); window.location.reload() }}>{i18n.t('navigation.logout')}</ExternalLink>
    </Menu>
    <PoweredBy/>
  </NavContainer>
)

