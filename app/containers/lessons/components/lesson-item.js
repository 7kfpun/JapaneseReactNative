import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { iOSColors } from 'react-native-typography';

import I18n from '../../../utils/i18n';
import tracker from '../../../utils/tracker';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingVertical: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '300',
    color: iOSColors.black,
  },
});

const LessonItem = ({ index, item, navigation }) => (
  <TouchableOpacity
    onPress={() => {
      navigation.navigate('select-mode', { item, navigation });
      tracker.logEvent('user-lessons-goto-select-mode', {
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

LessonItem.propTypes = {
  index: PropTypes.number.isRequired,
  item: PropTypes.number.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default LessonItem;
