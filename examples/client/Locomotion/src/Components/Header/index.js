import React from 'react';
import { ButtonHeaderView, Container, HeaderView } from './styled';
import SvgIcon from '../SvgIcon';
import SafeView from '../SafeView';

const Header = ({
  children, menuSide = 'left', onPressIcon, icon,
}) => (
  <SafeView>
      <Container>
        <ButtonHeaderView
          onPress={onPressIcon}
          data-test-id="headerButton">
          <HeaderView menuSide={menuSide}>
            <SvgIcon
              Svg={icon}
              height={20}
              width={20} />
          </HeaderView>
        </ButtonHeaderView>
        {children}
      </Container>
  </SafeView>
);

export default Header;
