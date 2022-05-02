import React from 'react';
import styled from 'styled-components';

const Footer = styled.div`
  display: flex;
  margin-top: 20px;
`;

const Button = styled.button`
  background: #fff;
  color: #7289da;
  padding: 7px 16px;
`;

const Header = styled.header`
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 16px;
`;

const Body = styled.div`

`;

export default styled(({
  className, header, text, button = 'Contact us',
}) => (
  <div className={className}>
    <Header>{header}</Header>
    <Body>{text}</Body>
    <Footer>
      <Button>{button}</Button>
    </Footer>
  </div>
))`
  background-color: #18191c;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0,0,0,.2);
  color: #fff;
  padding: 20px;
`;
