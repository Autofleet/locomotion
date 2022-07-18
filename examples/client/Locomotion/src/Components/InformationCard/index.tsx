import React from 'react';
import propsTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import Card from './Card';


export type InformationCardProps = {
  title?: string,
  children?: any,
  onPress?: () => void,
  verified?: boolean,
  showUnverified?: boolean
}

const InformationCard = ({
  title = '',
  children,
  onPress = undefined,
  verified = false,
  showUnverified = false,
  ...props
}: InformationCardProps) => (
  onPress
    ? (
      <TouchableOpacity onPress={onPress} {...props}>
        <Card
          title={title}
          onPress={onPress}
          verified={verified}
          showUnverified={showUnverified}
        >
          {children}
        </Card>
      </TouchableOpacity>
    )
    : (
      <View>
        <Card
          title={title}
          onPress={onPress}
          verified={verified}
          showUnverified={showUnverified}
        >
          {children}
        </Card>
      </View>
    )

);


InformationCard.defaultProps = {
  title: '',
  children: {},
  onPress: undefined,
  verified: false,
  showUnverified: false,
};

InformationCard.propTypes = {
  title: propsTypes.string,
  children: propsTypes.string,
  onPress: propsTypes.func,
  verified: propsTypes.bool,
  showUnverified: propsTypes.bool,
};

export default InformationCard;
