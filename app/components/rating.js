import React, { Component } from 'react';
import { func, number } from 'prop-types';

import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { noop, range } from '../utils/helpers';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  icon: {},
});

export default class Rating extends Component {
  state = {
    initialRating: this.props.initialRating,
  };

  handlePress(newCount) {
    const { initialRating } = this.state;

    if (newCount !== initialRating) {
      this.setState({ initialRating: newCount });
      // store.save(`lessons.assessment.${this.props.romaji}`, i);
      // tracker.logEvent('user-bookmark-save-item', { count: i });
    } else {
      // reset to 0 if set the same amount as previous
      this.setState({ initialRating: 0 });
      // store.delete(`lessons.assessment.${this.props.romaji}`);
      // tracker.logEvent('user-bookmark-unsave-item', { count: i }); // track the original count
    }

    this.props.onPress(newCount);
  }

  render() {
    const { starStyle, total, onPress } = this.props;
    const { initialRating } = this.state;
    const readonly = onPress === noop;

    console.log('initialRatinginitialRating', initialRating);
    return (
      <View style={styles.container}>
        {!readonly &&
          range(1, total + 1).map(i => (
            <TouchableOpacity key={i} onPress={() => this.handlePress(i)}>
              <Ionicons
                style={[styles.icon, starStyle]}
                name="ios-star"
                size={20}
                color={
                  initialRating >= i ? iOSColors.yellow : iOSColors.lightGray
                }
              />
            </TouchableOpacity>
          ))}

        {readonly &&
          range(0, total).map(i => (
            <Ionicons
              key={i}
              style={[styles.icon, starStyle]}
              name="ios-star"
              size={20}
              color={iOSColors.yellow}
            />
          ))}
      </View>
    );
  }
}

Rating.propTypes = {
  total: number,
  initialRating: number,
  starStyle: ViewPropTypes.style,
  onPress: func,
};

Rating.defaultProps = {
  total: 3,
  initialRating: 0,
  starStyle: {},
  onPress: noop,
};
