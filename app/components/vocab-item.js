import React, { Component } from 'react';
import { bool, number, oneOfType, shape, string } from 'prop-types';

import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { iOSColors } from 'react-native-typography';
import Tts from 'react-native-tts';

import { ttsSpeak } from '../utils/helpers';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
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
    marginTop: 6,
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
      <TouchableHighlight
        underlayColor="#F7F7F7"
        onPress={() => {
          ttsSpeak(item);
          tracker.logEvent('user-vocab-item-press-read', item);
        }}
      >
        <View style={styles.container}>
          <View style={styles.bodyLeft}>
            <Text style={styles.text}>{kana}</Text>
            {kanji !== kana && <Text style={styles.grayText}>{kanji}</Text>}
          </View>
          <View style={styles.bodyRight}>
            <Text style={styles.text}>
              {I18n.t(`minna.${lesson}.${romaji}`)}
            </Text>
            <Text style={styles.grayText}>
              {isShowLesson ? lesson : index + 1}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
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
