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

const BookmarkItem = ({ title, description, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <View>
      <Text style={styles.text}>{title}</Text>
      {description !== '' && (
        <Text style={styles.descriptionText}>{description}</Text>
      )}
    </View>
  </TouchableOpacity>
);

BookmarkItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  onPress: PropTypes.func,
};

BookmarkItem.defaultProps = {
  description: '',
  onPress: noop,
};

export default BookmarkItem;
