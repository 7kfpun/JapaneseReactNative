import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { iOSColors } from 'react-native-typography';

import { noop } from '../../../utils/helpers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 25,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 35,
    color: iOSColors.black,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 35,
    color: iOSColors.black,
  },
  lock: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default class ModeItem extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    isRequirePremium: PropTypes.bool,
    isUnlocked: PropTypes.bool,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    description: '',
    isRequirePremium: false,
    isUnlocked: false,
    onPress: noop,
  };

  render() {
    const {
      title,
      description,
      isUnlocked,
      isRequirePremium,
      onPress,
    } = this.props;

    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View>
          {isRequirePremium && (
            <Ionicons
              style={styles.lock}
              name={isUnlocked ? 'ios-star' : 'ios-lock'}
              size={20}
              color={iOSColors.yellow}
            />
          )}

          <Text style={styles.text}>{title}</Text>
          {description !== '' && (
            <Text style={styles.descriptionText}>{description}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}
