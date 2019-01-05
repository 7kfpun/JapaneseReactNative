import React, { Component } from 'react';
import { string } from 'prop-types';

import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import store from 'react-native-simple-store';

import { iOSColors } from 'react-native-typography';

import { range } from '../utils/helpers';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
    paddingVertical: 10,
    paddingHorizontal: 3,
  },
});

export default class SaveVocab extends Component {
  state = {
    count: 0,
  };

  componentDidMount() {
    this.checkStore();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.romaji !== this.props.romaji) {
      this.checkStore();
    }
  }

  checkStore = async () => {
    const count = await store.get(`lessons.assessment.${this.props.romaji}`);
    this.setState({ count });
  };

  save(i, count) {
    // reset to 0 if set the same amount as previous
    this.setState({ count: count === i ? 0 : i }, () => {
      store.save(`lessons.assessment.${this.props.romaji}`, this.state.count);
    });
  }

  render() {
    const { count } = this.state;

    return (
      <View style={styles.container}>
        {range(1, 4).map(i => (
          <TouchableOpacity key={i} onPress={() => this.save(i, count)}>
            <Ionicons
              style={styles.lock}
              name="ios-star"
              size={20}
              color={count >= i ? iOSColors.yellow : iOSColors.lightGray}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

SaveVocab.propTypes = {
  romaji: string.isRequired,
};
