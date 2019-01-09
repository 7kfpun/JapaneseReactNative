import React, { Component } from 'react';
import { bool, number, oneOfType, shape, string } from 'prop-types';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { iOSColors } from 'react-native-typography';
import Tts from 'react-native-tts';

import { ttsSpeak } from '../utils/helpers';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
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
    lineHeight: 24,
    color: iOSColors.black,
  },
  grayText: {
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 24,
    color: iOSColors.gray,
  },
});

export default class VocabItem extends Component {
  componentWillUnmount() {
    Tts.stop();
  }

  render() {
    const {
      item: { kanji, kana, romaji },
      item,
      index,
      lesson,
      isShowLesson,
    } = this.props;

    return (
      <TouchableOpacity
        onPress={() => {
          ttsSpeak(item);
          tracker.logEvent('user-vocab-item-press-read', item);
        }}
      >
        <View style={styles.container}>
          <View style={styles.bodyLeft}>
            <Text style={styles.text}>{kana}</Text>
            <Text style={styles.grayText}>{kanji !== kana ? kanji : ''}</Text>
          </View>
          <View style={styles.bodyRight}>
            <Text style={styles.text}>
              {I18n.t(`minna.${lesson}.${romaji}`)}
            </Text>
            {isShowLesson && <Text style={styles.grayText}>{lesson}</Text>}
            {!isShowLesson && <Text style={styles.grayText}>{index + 1}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

VocabItem.propTypes = {
  index: number.isRequired,
  item: shape({
    kanji: string.isRequired,
    kana: string.isRequired,
    romaji: string.isRequired,
  }).isRequired,
  lesson: oneOfType([string, number]).isRequired,
  isShowLesson: bool,
};

VocabItem.defaultProps = {
  isShowLesson: false,
};
