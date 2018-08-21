import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import { iOSColors } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tts from 'react-native-tts';

import { cleanWord, noop } from '../utils/helpers';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: iOSColors.white,
  },
  containerInner: {
    flex: 1,
    ...Platform.select({
      ios: {
        justifyContent: 'center',
      },
    }),
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontWeight: '800',
    color: iOSColors.black,
  },
  thinText: {
    textAlign: 'center',
    fontWeight: '300',
    color: iOSColors.black,
  },
});

export default class Card extends Component {
  static propTypes = {
    lesson: PropTypes.number,
    kanji: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    kana: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    romaji: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    translation: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),

    isKanjiShown: PropTypes.bool,
    isKanaShown: PropTypes.bool,
    isRomajiShown: PropTypes.bool,
    isTranslationShown: PropTypes.bool,

    answers: PropTypes.oneOfType([null, PropTypes.arrayOf([PropTypes.string])]),
    removeAnswer: PropTypes.func,
    navigation: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    lesson: 0,
    kanji: '',
    kana: '',
    romaji: '',
    translation: '',
    answers: [],
    removeAnswer: noop,

    isKanjiShown: true,
    isKanaShown: true,
    isRomajiShown: true,
    isTranslationShown: true,
  };

  componentWillUnmount() {
    Tts.stop();
  }

  render() {
    const {
      lesson,
      kanji,
      kana,
      romaji,
      translation,
      answers,
      removeAnswer,

      isKanjiShown,
      isKanaShown,
      isRomajiShown,
      isTranslationShown,

      navigation,
    } = this.props;
    const isTooLong = Platform.OS === 'android' || (kana && kana.length >= 8);
    const answerLength = answers.length;

    const isCorrect = answers.join('') === cleanWord(kana);
    const isWrong = !cleanWord(kana).startsWith(answers.join(''));

    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        underlayColor={iOSColors.gray}
        onPress={() => {
          Tts.stop();
          Tts.setDefaultLanguage('ja');
          Tts.speak(cleanWord(kana));
        }}
      >
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity
              style={{ paddingTop: 10, paddingHorizontal: 15 }}
              onPress={() => {
                navigation.navigate('vocab-feedback', {
                  item: {
                    kanji,
                    kana,
                    romaji,
                  },
                  lesson,
                });
              }}
            >
              <Ionicons name="ios-flag-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.containerInner}>
            {kana && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: width - 100,
                  paddingBottom: 5,
                }}
              >
                <Fragment>
                  {!isCorrect &&
                    !isWrong && (
                      <Ionicons name="md-checkmark" size={28} color="white" />
                    )}

                  {isCorrect && (
                    <Animatable.View animation="fadeIn">
                      <Ionicons name="md-checkmark" size={28} color="green" />
                    </Animatable.View>
                  )}

                  {isWrong && (
                    <Animatable.View animation="fadeIn">
                      <Ionicons name="md-close" size={28} color="red" />
                    </Animatable.View>
                  )}
                </Fragment>
                <Text
                  style={[
                    styles.text,
                    {
                      color: !isKanaShown
                        ? iOSColors.white
                        : answers.length > 0
                          ? iOSColors.customGray
                          : iOSColors.black,
                      fontSize: isTooLong ? 20 : 28,
                    },
                  ]}
                >
                  <Text style={{ color: 'black' }}>
                    {answers.join('').substring(0, answerLength)}
                  </Text>
                  {answerLength > 0
                    ? cleanWord(kana).substring(answerLength, kana.length)
                    : kana}
                </Text>
                <TouchableOpacity
                  style={styles.answerBack}
                  onPress={() => removeAnswer()}
                >
                  {answers.length > 0 ? (
                    <Animatable.View animation="fadeIn">
                      <Ionicons
                        name="ios-backspace-outline"
                        size={28}
                        color={
                          answers.length > 0 ? iOSColors.black : iOSColors.white
                        }
                      />
                    </Animatable.View>
                  ) : (
                    <Ionicons
                      name="ios-backspace-outline"
                      size={28}
                      color="white"
                    />
                  )}
                </TouchableOpacity>
              </View>
            )}

            <View
              style={{
                width: width - 140,
                borderBottomColor: iOSColors.midGray,
                borderBottomWidth: 1,
              }}
            />

            <View
              style={{
                paddingHorizontal: 30,
              }}
            >
              {isKanjiShown &&
                kana !== kanji && (
                  <Text
                    style={[
                      styles.text,
                      { marginTop: 20, fontSize: isTooLong ? 14 : 24 },
                    ]}
                  >
                    {kanji}
                  </Text>
                )}
              {isRomajiShown && (
                <Text
                  style={[
                    styles.thinText,
                    { marginTop: 10, fontSize: isTooLong ? 14 : 20 },
                  ]}
                >
                  {romaji}
                </Text>
              )}
              {isTranslationShown && (
                <Text
                  style={[
                    styles.thinText,
                    { marginTop: 20, fontSize: isTooLong ? 14 : 20 },
                  ]}
                >
                  {translation}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
