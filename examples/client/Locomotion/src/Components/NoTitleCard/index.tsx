import React from 'react';
import propsTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import {
  ArrowContainer, CardContainer, CardText, Arrow,
} from '../InformationCard/styled';
import Button from '../Button';

type NoTitleCardProps = {
    onPress: () => void | undefined,
    children: any,
    showArrow: boolean,
}

const NoTitleCard = ({
  onPress, children, showArrow, ...props
} : NoTitleCardProps) => (
  <Button noBackground onPress={onPress} {...props}>
    <CardContainer>
      <CardText style={{ marginVertical: 10 }}>{children}</CardText>
      <ArrowContainer>{showArrow ? <Arrow /> : undefined}</ArrowContainer>
    </CardContainer>
  </Button>
);

NoTitleCard.defaultProps = {
  onPress: undefined,
  showArrow: false,
};

NoTitleCard.propTypes = {
  onPress: propsTypes.func,
  showArrow: propsTypes.bool,
};

export default NoTitleCard;
