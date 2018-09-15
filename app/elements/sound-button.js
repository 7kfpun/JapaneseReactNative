import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TouchableHighlight } from 'react-native';

import { iOSColors } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { noop } from '../utils/helpers';

export default class SoundButton extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    containerStyles: TouchableHighlight.propTypes.style,
  };

  static defaultProps = {
    containerStyles: {},
  };

  static defaultProps = {
    onPress: noop,
  };

  render() {
    const { containerStyles } = this.props;
    return (
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
        onPress={() => {
          this.props.onPress();
        }}
      >
        <Ionicons name="ios-volume-low" color={iOSColors.white} size={24} />
      </TouchableHighlight>
    );
  }
}
