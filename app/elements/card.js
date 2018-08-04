import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  Dimensions,
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
    justifyContent: 'center',
    alignItems: 'center',
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
    lesson: PropTypes.number,
    kanji: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    kana: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    romaji: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    translation: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    answers: PropTypes.oneOfType([null, PropTypes.arrayOf([PropTypes.string])]),
    removeAnswer: PropTypes.func,
    isHideAnswer: PropTypes.bool,
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
    isHideAnswer: false,
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
      isHideAnswer,
      navigation,
    } = this.props;
    const isTooLong = kanji && kanji.length > 10;
    const answerLength = answers.length;

    const isCorrect = answers.join('') === cleanWord(kana);
    const isWrong = !cleanWord(kana).startsWith(answers.join(''));

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
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity
              style={{ paddingTop: 10, paddingRight: 10 }}
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
              <Ionicons
                name="ios-help-circle-outline"
                size={24}
                color="black"
              />
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
                      color: isHideAnswer
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
                    ? cleanWord(kana.substring(answerLength, kana.length))
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
              {kanji &&
                kana !== kanji && (
                  <Text
                    style={[
                      styles.text,
                      { marginTop: 20, fontSize: isTooLong ? 16 : 24 },
                    ]}
                  >
                    {kanji}
                  </Text>
                )}
              {romaji && (
                <Text
                  style={[
                    styles.thinText,
                    { marginTop: 10, fontSize: isTooLong ? 16 : 20 },
                  ]}
                >
                  {romaji}
                </Text>
              )}
              {translation && (
                <Text
                  style={[
                    styles.thinText,
                    { marginTop: 20, fontSize: isTooLong ? 16 : 20 },
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
