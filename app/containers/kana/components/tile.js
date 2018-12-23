import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import store from 'react-native-simple-store';
import Tts from 'react-native-tts';

import tracker from '../../../utils/tracker';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: width / 5,
    borderRightColor: iOSColors.lightGray,
    borderRightWidth: 0.5,
    borderBottomColor: iOSColors.lightGray,
    borderBottomWidth: 0.5,
  },
  upperDot: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  upperRow: {
    flex: 1,
    alignItems: 'center',
  },
  upperText: {
    color: iOSColors.black,
    fontSize: 26,
    fontWeight: '300',
  },
  lowerRow: {
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lowerText: {
    fontSize: 16,
    fontWeight: '300',
    color: iOSColors.gray,
  },
});

export default class Tile extends Component<Props> {
  static propTypes = {
    hiragana: PropTypes.string.isRequired,
    katakana: PropTypes.string.isRequired,
    romaji: PropTypes.string.isRequired,
    itemsPerRow: PropTypes.number,
  };

  static defaultProps = {
    itemsPerRow: 5,
  };

  state = {
    isCorrect: null,
  };

  componentDidMount() {
    const { romaji } = this.props;

    store
      .get(`kana.assessment.${romaji}`)
      .then(isCorrect => this.setState({ isCorrect }));
  }

  render() {
    const { hiragana, katakana, romaji, itemsPerRow } = this.props;
    const { isCorrect } = this.state;

    return (
      <TouchableOpacity
        style={[styles.container, { width: width / itemsPerRow }]}
        onPress={() => {
          Tts.setDefaultLanguage('ja');
          Tts.speak(hiragana);
          tracker.logEvent('user-action-press-kana-read', { text: hiragana });
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 4,
          }}
        >
          <View style={styles.upperDot}>
            {isCorrect && (
              <Ionicons name="ios-add-circle" size={8} color="green" />
            )}
            {isCorrect === false && (
              <Ionicons name="ios-add-circle" size={8} color="red" />
            )}
            {isCorrect === null && (
              <Ionicons name="ios-add-circle" size={8} color="white" />
            )}
          </View>
          <View style={styles.upperRow}>
            <Text style={styles.upperText}>{hiragana}</Text>
          </View>
          <View style={styles.lowerRow}>
            <Text style={styles.lowerText}>{katakana}</Text>
            <Text style={styles.lowerText}>{romaji}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
