import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { iOSColors } from 'react-native-typography';

import I18n from '../../../utils/i18n';
import tracker from '../../../utils/tracker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 20,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
    fontWeight: '300',
    color: iOSColors.black,
  },
});

const LessonItem = ({ item, navigation }) => (
  <TouchableOpacity
    onPress={() => {
      navigation.navigate('select-mode', { item, navigation });
      tracker.logEvent('user-lessons-goto-select-mode', {
        lesson: `${item}`,
      });
    }}
  >
    <View style={styles.container}>
      <Text style={styles.text}>
        {I18n.t('app.common.lesson-no', { lesson_no: item })}
      </Text>
    </View>
  </TouchableOpacity>
);

LessonItem.propTypes = {
  item: PropTypes.number.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default LessonItem;
