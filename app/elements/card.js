import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import Tts from 'react-native-tts';

import { cleanWord } from '../utils/helpers';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: iOSColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    borderColor: iOSColors.lightGray,
    borderWidth: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    paddingTop: 60,
  },
  text: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: iOSColors.black,
  },
  thinText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '300',
    color: iOSColors.black,
  },
});

export default class VocabItem extends Component {
  static propTypes = {
    kanji: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    kana: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    romaji: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    translation: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }

  static defaultProps = {
    kanji: '',
    kana: '',
    romaji: '',
    translation: '',
  }

  componentWillUnmount() {
    Tts.stop();
  }

  render() {
    const {
      kanji,
      kana,
      romaji,
      translation,
    } = this.props;

    return (
      <TouchableOpacity
        style={{
          flex: 1,
        }}
        underlayColor={iOSColors.gray}
        onPress={() => {
          Tts.stop();
          Tts.setDefaultLanguage('ja');
          Tts.speak(cleanWord(kana));
        }}
      >
        <View style={styles.container}>
          {kana && kana !== kanji && <View
            style={{
              alignItems: 'center',
              width: width - 150,
              paddingBottom: 5,
              borderBottomColor: iOSColors.midGray,
              borderBottomWidth: 1,
            }}
          >
            <Text style={[styles.text, { color: iOSColors.gray }]}>{kana}</Text>
          </View>}
          {kanji && <Text style={[styles.text, { lineHeight: 60 }]}>{kanji}</Text>}
          {romaji && <Text style={[styles.thinText, { lineHeight: 40 }]}>{romaji}</Text>}
          {translation && <Text style={[styles.thinText, { lineHeight: 60 }]}>{translation}</Text>}
        </View>
      </TouchableOpacity>
    );
  }
}
