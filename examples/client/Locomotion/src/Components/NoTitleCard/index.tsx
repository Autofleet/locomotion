import React from 'react';
import propsTypes from 'prop-types';
import {
  ArrowContainer, CardContainer, CardText, Arrow,
} from '../InformationCard/styled';
import Button from '../Button';

type NoTitleCardProps = {
  onPress?: () => void,
  children: any,
  showArrow?: boolean,
}

function NoTitleCard({
  onPress, children, showArrow = false, ...props
}: NoTitleCardProps) {
  return (
    <Button noBackground onPress={onPress} {...props}>
      <CardContainer>
        <CardText style={{ marginVertical: 10 }}>{children}</CardText>
        <ArrowContainer>{showArrow ? <Arrow /> : undefined}</ArrowContainer>
      </CardContainer>
    </Button>
  );
}

NoTitleCard.propTypes = {
  onPress: propsTypes.func,
  showArrow: propsTypes.bool,
};

export default NoTitleCard;
