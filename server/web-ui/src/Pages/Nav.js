import React from 'react';
import styled from 'styled-components';
import logoSrc from '../assets/logo2.png';
import logoSmallSrc from '../assets/logo.png';
import {
  NavLink
} from "react-router-dom";

import HelpBubble from '../Common/HelpBubble';

export const navWidthPx = 280;

const NavContainer = styled.div`
  //background-color: rgb(227, 227, 227);
  width: ${navWidthPx}px;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  //border-right: 1px solid #38444d;  
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
  cursor: pointer;
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

const LogoSmall = styled.img.attrs({ src: logoSmallSrc })`
  width: 95px;
  margin-top: auto;
  position: fixed;
  bottom: 10px;
`;

export default () => (
  <NavContainer>
    <Logo />
    <Menu>
      <Header>Management</Header>
      <MenuItem exact to="/">
        Users
      </MenuItem>
      {/*<MenuItem to="/stats">*/}
      {/*  Response Stats*/}
      {/*</MenuItem>*/}
      {/*<MenuItem to="/webhooks">*/}
      {/*  Fleet Webhooks*/}
      {/*</MenuItem>*/}
      <Header>Support</Header>
      <ExternalLink target="_blank" href="https://docs.autofleet.io/reference#get_vehicles-tasks"> Docs </ExternalLink>
      <ExternalLink target="_blank"> Support Chat (Coming soon) </ExternalLink> {/* href="https://gitter.im/autofleet-fleet-api/community"  */}
      <ExternalLink> Status (Coming soon) </ExternalLink>

      <Header onClick={() => { localStorage.removeItem('token'); window.location.reload() }}>Logout</Header>
    </Menu>
    {/*<LogoSmall/>*/}
    {/* <HelpBubble header="Hav some problem?" text="If you have any problem with the tool or some other text let us know" /> */}
  </NavContainer>
)

