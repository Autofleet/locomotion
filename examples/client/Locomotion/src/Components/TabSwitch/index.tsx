import React from 'react';
import SvgIcon from '../SvgIcon';
import i18n from '../../I18n';
import {
  Container, SELECTED_COLOR, Tab, TabInner, TextContainer, UNSELECTED_COLOR,
} from './styled';

interface ITabSwitchProps {
    onUnselectedClick: (tab) => void
    activeTabId: string;
    tabs: {
        textKey: string;
        id: string;
        Svg: any;
    }[];
}

const TabSwitch = ({ onUnselectedClick, tabs, activeTabId }: ITabSwitchProps) => (
  <Container>

    {tabs.map((tab) => {
      const isSelected = tab.id === activeTabId;
      return (
        <Tab
          testID={tab.id}
          key={tab.id}
          id={tab.id}
          onPress={() => {
            if (!isSelected) {
              onUnselectedClick(tab);
            }
          }}
          isSelected={isSelected}
        >
          <TabInner isSelected={isSelected}>

            {tab.Svg
                  && (
                  <SvgIcon
                    stroke={isSelected ? SELECTED_COLOR : UNSELECTED_COLOR}
                    Svg={tab.Svg}
                    width={20}
                    height={20}
                  />
                  )
            }
            <TextContainer isSelected={isSelected}>
              {i18n.t(tab.textKey)}
            </TextContainer>

          </TabInner>
        </Tab>
      );
    })}

  </Container>
);
export default TabSwitch;
