import React, { Component } from 'react';
import { string } from 'prop-types';

import { StyleSheet, View } from 'react-native';

import { iOSColors } from 'react-native-typography';
import store from 'react-native-simple-store';

import Rating from './rating';

import tracker from '../utils/tracker';

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
  icon: {
    paddingVertical: 16,
    paddingHorizontal: 3,
  },
});

export default class SaveVocab extends Component {
  state = {
    initialRating: 0,
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
    const initialRating = await store.get(
      `lessons.assessment.${this.props.romaji}`
    );
    this.setState({ initialRating, key: Math.random() });
  };

  save(newRating) {
    const { initialRating } = this.state;
    const { romaji } = this.props;

    if (initialRating !== newRating) {
      store.save(`lessons.assessment.${romaji}`, newRating);
      tracker.logEvent('user-bookmark-save-item', {
        value: newRating.toString(),
        label: romaji,
      });
    } else {
      // reset to 0 if set the same amount as previous
      store.delete(`lessons.assessment.${romaji}`);
      tracker.logEvent('user-bookmark-unsave-item', {
        value: newRating.toString(),
        label: romaji,
      }); // track the original initialRating
    }
  }

  render() {
    const { initialRating, key } = this.state;

    return (
      <View style={styles.container}>
        <Rating
          key={key}
          total={3}
          initialRating={initialRating}
          starStyle={styles.icon}
          onPress={newRating => this.save(newRating)}
        />
      </View>
    );
  }
}

SaveVocab.propTypes = {
  romaji: string.isRequired,
};
