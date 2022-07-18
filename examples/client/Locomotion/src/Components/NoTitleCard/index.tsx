import React from 'react';
import propsTypes from 'prop-types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  ArrowContainer, CardContainer, CardContantContainer, CardText, Arrow,
} from '../InformationCard/styled';

type NoTitleCardProps = {
    onPress: () => void | undefined,
    children: any,
}

const NoTitleCard = ({ onPress, children, ...props } : NoTitleCardProps) => (
  <TouchableOpacity onPress={onPress} {...props}>
    <CardContainer>
      <CardContantContainer>
        <CardText style={{ marginVertical: 10 }}>{children}</CardText>
      </CardContantContainer>
      <ArrowContainer>{onPress !== undefined ? <Arrow /> : undefined}</ArrowContainer>
    </CardContainer>
  </TouchableOpacity>
);

NoTitleCard.defaultProps = {
  onPress: undefined,
};

NoTitleCard.propTypes = {
  onPress: propsTypes.func,
};

export default NoTitleCard;
