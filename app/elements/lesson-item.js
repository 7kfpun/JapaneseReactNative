import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { iOSColors } from 'react-native-typography';

import I18n from '../utils/i18n';
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
  };

  render() {
    const { item, index } = this.props;
    const { navigation } = this.props;

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('vocab-list', { item });
          tracker.logEvent('user-action-goto-vocab-list', {
            lesson: `${item}`,
          });
        }}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: index % 2 ? '#F7F7F7' : 'white' },
          ]}
        >
          <Text style={styles.text}>
            {I18n.t('app.common.lesson_no', { lesson_no: item })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
