import React from 'react';
import styled from 'styled-components/native';
import SvgIcon from '../SvgIcon';
import i18n from '../../I18n';

const SELECTED_COLOR = '#212229';
const UNSELECTED_COLOR = '#666975';
interface ITabSwitchProps {
    onUnselectedClick: (tab) => void
    activeTabId: string;
    tabs: {
        textKey: string;
        id: string;
        Svg: any;
    }[];
}
interface TabStyled {
    isSelected: boolean;
}
const Container = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-color: rgba(125, 139, 172, 0.32)
  border-bottom-width: 1px;
  border-bottom-color: #7D8BAC52;
  margin-bottom: 16px;
  padding-left: 8px;
  padding-right: 8px;
`;

const Tab = styled.TouchableOpacity`
  height: 40px;
  justify-content: center;
  align-items: center;
  flex: 1 0 0;
  text-align: center; 
  ${({ isSelected }: TabStyled) => isSelected && `border-bottom-width: 2px; border-bottom-color: ${SELECTED_COLOR};`}
  margin-left: 8px;
  margin-right: 8px;
`;
const TabInner = styled.View`
display: flex;
flex-direction: row;
height: 32px;
padding: 4px;
justify-content: center;
align-items: center;
color: ${({ isSelected }: TabStyled) => (isSelected ? SELECTED_COLOR : UNSELECTED_COLOR)};
font-family: Montserrat;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 24px;
`;
const TextContainer = styled.Text`
color: #666975;
color: ${({ isSelected }: TabStyled) => (isSelected ? SELECTED_COLOR : UNSELECTED_COLOR)};
/* Body - Mobile */
font-family: Montserrat;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 24px; /* 150% */
padding-left: 4px;
`;


const TabSwitch = ({ onUnselectedClick, tabs, activeTabId }: ITabSwitchProps) => (
  <Container>

    {tabs.map((tab) => {
      const isSelected = tab.id === activeTabId;
      return (
        <Tab
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
