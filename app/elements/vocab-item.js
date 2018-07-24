import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import Tts from 'react-native-tts';

import I18n from '../utils/i18n';
import tracker from '../utils/tracker';
import { cleanWord } from '../utils/helpers';

Tts.setDefaultRate(0.4);
Tts.setDefaultLanguage('ja');
Tts.setDucking(true);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  bodyLeft: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bodyRight: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  text: {
    fontSize: 16,
    fontWeight: '300',
  },
});

export default class VocabItem extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    item: PropTypes.shape({
      kanji: PropTypes.string.isRequired,
      kana: PropTypes.string.isRequired,
      romaji: PropTypes.string.isRequired,
      lesson: PropTypes.string,
    }).isRequired,
  }

  componentWillUnmount() {
    Tts.stop();
  }

  render() {
    const {
      item: {
        kanji,
        kana,
        romaji,
        lesson,
      },
      item,
      index,
    } = this.props;

    return (
      <TouchableOpacity
        onPress={() => {
          // Tts.stop();
          Tts.speak(cleanWord(kana));
          tracker.logEvent('user-action-press-speak', { item });
        }}
      >
        <View style={[styles.container, { backgroundColor: index % 2 ? iOSColors.customGray : 'white' }]}>
          <View style={styles.bodyLeft}>
            <Text style={styles.text}>{kana}</Text>
            <Text style={[styles.text, { paddingTop: 12 }]}>{kanji !== kana ? kanji : ''}</Text>
          </View>
          <View style={styles.bodyRight}>
            <Text style={styles.text}>{I18n.t(`minna.${romaji}`)}</Text>
            {!!lesson && <Text style={[styles.text, { paddingTop: 12, color: iOSColors.gray }]}>{lesson}</Text>}
            {!lesson && <Text style={[styles.text, { paddingTop: 12, color: iOSColors.gray }]}>{index + 1}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
