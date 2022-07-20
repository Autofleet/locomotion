import React from 'react';
import propsTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import Card from './Card';


export type InformationCardProps = {
  title?: string,
  children?: any,
  onPress?: () => void,
  verified?: boolean,
  showUnverified?: boolean,
  icon?: any,
  onIconPress?: () => void
}

const InformationCard = ({
  title = '',
  children,
  onPress = undefined,
  verified = false,
  showUnverified = false,
  icon = undefined,
  onIconPress,
  ...props
}: InformationCardProps) => (
  onPress
    ? (
      <TouchableOpacity onPress={onPress} {...props} style={{ flex: 1 }}>
        { children
          ? (
            <Card
              title={title}
              onPress={onPress}
              verified={verified}
              showUnverified={showUnverified}
              icon={icon}
              onIconPress={onIconPress}
            >
              {children}
            </Card>
          ) : (
            <Card
              title={title}
              onPress={onPress}
              verified={verified}
              showUnverified={showUnverified}
              icon={icon}
              onIconPress={onIconPress}
            />
          )}
      </TouchableOpacity>
    )
    : (
      <View>
        { children
          ? (
            <Card
              title={title}
              onPress={onPress}
              verified={verified}
              showUnverified={showUnverified}
              icon={icon}
              onIconPress={onIconPress}
            >
              {children}
            </Card>
          ) : (
            <Card
              title={title}
              onPress={onPress}
              verified={verified}
              showUnverified={showUnverified}
              icon={icon}
              onIconPress={onIconPress}
            />
          )}
      </View>
    )

);


InformationCard.defaultProps = {
  title: '',
  children: {},
  onPress: undefined,
  verified: false,
  showUnverified: false,
  icon: undefined,
  onIconPress: undefined,
};

InformationCard.propTypes = {
  title: propsTypes.string,
  children: propsTypes.oneOfType([
    propsTypes.arrayOf(propsTypes.node),
    propsTypes.node, propsTypes.any,
  ]),
  onPress: propsTypes.func,
  verified: propsTypes.bool,
  showUnverified: propsTypes.bool,
  onIconPress: propsTypes.func,
};

export default InformationCard;
