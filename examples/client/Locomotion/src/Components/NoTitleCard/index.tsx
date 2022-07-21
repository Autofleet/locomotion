import React from 'react';
import propsTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import {
  ArrowContainer, CardContainer, CardContentContainer, CardText, Arrow,
} from '../InformationCard/styled';

type NoTitleCardProps = {
    onPress: () => void | undefined,
    children: any,
    showArrow: boolean,
}

const NoTitleCard = ({
  onPress, children, showArrow, ...props
} : NoTitleCardProps) => (
  <TouchableOpacity onPress={onPress} {...props}>
    <CardContainer>
      <CardContentContainer>
        <CardText style={{ marginVertical: 10 }}>{children}</CardText>
      </CardContentContainer>
      <ArrowContainer>{showArrow ? <Arrow /> : undefined}</ArrowContainer>
    </CardContainer>
  </TouchableOpacity>
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
