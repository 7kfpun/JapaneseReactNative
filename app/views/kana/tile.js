import React from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import Tts from 'react-native-tts';

import tracker from '../../utils/tracker';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: width / 5,
    borderRightColor: iOSColors.tealBlue,
    borderRightWidth: 0.5,
    borderBottomColor: iOSColors.tealBlue,
    borderBottomWidth: 0.5,
  },
  upperRow: {
    flex: 1,
    alignItems: 'center',
  },
  upperText: {
    fontSize: 30,
    lineHeight: 34,
  },
  lowerRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  lowerText: {
    fontSize: 16,
    fontWeight: '300',
    color: iOSColors.midGray,
  },
});

const Tile = ({ hiragana, katakana, romaji, itemsPerRow }) => (
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
        padding: 5,
      }}
    >
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

Tile.propTypes = {
  hiragana: PropTypes.string.isRequired,
  katakana: PropTypes.string.isRequired,
  romaji: PropTypes.string.isRequired,
  itemsPerRow: PropTypes.number,
};

Tile.defaultProps = {
  itemsPerRow: 5,
};

export default Tile;
