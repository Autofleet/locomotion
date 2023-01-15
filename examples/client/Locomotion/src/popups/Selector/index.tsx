/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import CloseButton from '../../Components/CloseButton';
import i18n from '../../I18n';
import {
  SummaryContainer,
  Title,
  Container,
  Footer,
  TitleView,
  ItemsScrollView,
  SelectButton,
  ItemInnerContainer,
  ItemContainer,
  ItemTextContainer,
} from './styled';
import { FlexCont } from '../../Components/Flex';
import Button from '../../Components/Button';

const Item = ({ item, onPress, selected }) => (
  <Button
    noBackground
    testID={`languageItem-${item.value}`}
    onPress={onPress}
  >
    <ItemContainer selected={selected}>
      <ItemInnerContainer>
        <ItemTextContainer>
          {item.label}
        </ItemTextContainer>
      </ItemInnerContainer>
    </ItemContainer>
  </Button>
);

interface ItemSelectorProps {
  isVisible: boolean;
  onCancel: () => void;
  onSubmit: (number) => void;
  selected: any;
  items: [];
  title: string;
}

const ItemSelector = ({
  isVisible, onCancel, onSubmit, items, selected, title,
}: ItemSelectorProps) => {
  const [selectedItem, setSelectedItem] = useState<number>(selected);

  useEffect(() => {
    setSelectedItem(selected);
  }, [selected]);

  const onSave = () => {
    onSubmit(selectedItem);
    onCancel();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onCancel}
    >
      <SummaryContainer>
        <TitleView>
          <Title>{title}</Title>
          <CloseButton onPress={async () => {
            setSelectedItem(selected);
            onCancel();
          }}
          />
        </TitleView>
        <ItemsScrollView>
          <Container>
            {items.map((item: any, i) => (
              <Item
                selected={selectedItem === i}
                item={item}
                onPress={() => {
                  setSelectedItem(i);
                }}
              />
            ))}
          </Container>
        </ItemsScrollView>
        <Footer>
          <FlexCont style={{ justifyContent: 'center' }}>
            <SelectButton
              type="confirm"
              onPress={() => {
                onSave();
              }}
            >
              {i18n.t('general.select')}
            </SelectButton>
          </FlexCont>
        </Footer>
      </SummaryContainer>
    </Modal>
  );
};

ItemSelector.propTypes = {
  onSave: PropTypes.func,
  showCash: PropTypes.bool,
  rideFlow: PropTypes.bool,
  selected: PropTypes.string,
};

ItemSelector.defaultProps = {
  onSave: null,
  showCash: true,
  rideFlow: false,
  selected: null,
};

export default ItemSelector;
