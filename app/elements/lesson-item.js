import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';

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
  render() {
    const { item, index } = this.props;
    const { navigation } = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('VocabList', { item });
        }}
      >
        <View style={[styles.container, { backgroundColor: index % 2 ? iOSColors.customGray : 'white' }]}>
          <Text style={styles.text}>第 {item} 課</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

LessonItem.propTypes = {
};
