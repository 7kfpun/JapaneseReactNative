import React from 'react';
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
    padding: 20,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
    fontWeight: '300',
    color: iOSColors.black,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 35,
    color: iOSColors.black,
  },
  lock: {},
});

const ModeItem = ({
  title,
  description,
  isUnlocked,
  isRequirePremium,
  onPress,
}) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
      <View style={{ flex: 1 }}>
        <Text style={styles.text}>{title}</Text>
        {description !== '' && (
          <Text style={styles.descriptionText}>{description}</Text>
        )}
      </View>

      {isRequirePremium && (
        <Ionicons
          style={styles.lock}
          name={isUnlocked ? 'ios-star' : 'ios-lock'}
          size={20}
          color={iOSColors.yellow}
        />
      )}
    </View>
  </TouchableOpacity>
);

ModeItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  isRequirePremium: PropTypes.bool,
  isUnlocked: PropTypes.bool,
  onPress: PropTypes.func,
};

ModeItem.defaultProps = {
  description: '',
  isRequirePremium: false,
  isUnlocked: false,
  onPress: noop,
};

export default ModeItem;
