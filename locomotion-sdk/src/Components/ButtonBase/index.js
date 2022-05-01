import React from 'react'
import { TouchableOpacity } from 'react-native';
import Mixpanel from '../../services/Mixpanel';

const BaseButton = (props) => {
    return (
        <TouchableOpacity
        {...props}
        onPress={(e) => { /* eslint-disable-line consistent-return */
          if (props.onPress) {
            Mixpanel.trackElementClick(props);
            return props.onPress(e);
          }
        }}
      >
        {props.children}
      </TouchableOpacity>);
  };
  
  
  export default BaseButton;