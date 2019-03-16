import React from 'react';
import { func, string } from 'prop-types';

import { TouchableHighlight } from 'react-native';

import { iOSColors } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { noop } from '../utils/helpers';

const CircleButton = ({
  containerStyles,
  iconName,
  onPress,
  onPressIn,
  onPressOut,
}) => (
  <TouchableHighlight
    style={{
      ...containerStyles,
      height: 48,
      width: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: iOSColors.tealBlue,
    }}
    underlayColor={iOSColors.midGray}
    onPress={onPress}
    onPressIn={onPressIn}
    onPressOut={onPressOut}
  >
    <Ionicons name={iconName} color={iOSColors.white} size={24} />
  </TouchableHighlight>
);

CircleButton.propTypes = {
  containerStyles: TouchableHighlight.propTypes.style,
  onPress: func,
  onPressIn: func,
  onPressOut: func,
  iconName: string,
};

CircleButton.defaultProps = {
  containerStyles: {},
  onPress: noop,
  onPressIn: noop,
  onPressOut: noop,
  iconName: 'ios-volume-high',
};

export default CircleButton;
