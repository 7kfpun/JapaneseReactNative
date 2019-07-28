import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import store from 'react-native-simple-store';
import Tts from 'react-native-tts';

import { colors } from '../../../utils/styles';
import tracker from '../../../utils/tracker';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: (width - 20) / 5,
    borderColor: colors.lightGray,
    borderWidth: 0.5,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 20,
  },
  body: {
    flex: 1,
    padding: 10,
  },
  upperRow: {
    flex: 1,
    alignItems: 'center',
  },
  upperText: {
    color: colors.black,
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
    color: colors.midGray,
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

  componentWillUnmount() {
    Tts.stop();
  }

  render() {
    const { hiragana, katakana, romaji, itemsPerRow } = this.props;
    const { isCorrect } = this.state;

    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            width: width / itemsPerRow - 10,
          },
          isCorrect !== null
            ? {
                borderColor: isCorrect ? 'green' : 'red',
              }
            : {},
        ]}
        onPress={() => {
          Tts.setDefaultRate(0.1);
          Tts.setDefaultLanguage('ja');
          Tts.speak(hiragana);
          tracker.logEvent('user-kana-tile-press-read', { text: hiragana });
        }}
      >
        <View style={styles.body}>
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
