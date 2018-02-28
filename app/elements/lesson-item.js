import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';

import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingVertical: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '300',
  },
});

export default class LessonItem extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
    item: PropTypes.number.isRequired,
  }


  render() {
    const { item, index } = this.props;
    const { navigation } = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('VocabList', { item });
          tracker.logEvent('user-action-goto-vocab-list', { item });
        }}
      >
        <View style={[styles.container, { backgroundColor: index % 2 ? iOSColors.customGray : 'white' }]}>
          <Text style={styles.text}>Lesson {item}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
