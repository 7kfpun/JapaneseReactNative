import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tts from 'react-native-tts';

import { choice, shuffle } from '../../utils/helpers';
import { items as vocabularies } from '../../utils/items';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import AdMob from '../../components/admob';
import CustomButton from '../../components/button';
import SoundButton from '../../components/sound-button';

import { config } from '../../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  headerRight: {
    paddingRight: 10,
    color: iOSColors.gray,
  },
  mode: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  card: {
    flex: 4,
    paddingHorizontal: 26,
    ...Platform.select({
      ios: {
        paddingBottom: 30,
      },
      android: {
        paddingBottom: 0,
      },
    }),
  },
  cardBody: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: iOSColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  cardText: {
    fontSize: 32,
    textAlign: 'center',
  },
  tileBlock: {
    flex: 3,
    paddingHorizontal: 40,
  },
  tile: {
    flex: 1,
    margin: 5,
    backgroundColor: iOSColors.white,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  tileText: {
    fontSize: 12,
    fontWeight: '300',
    textAlign: 'center',
  },
  selectors: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
});

const getNextMode = (modeAll, modeOriginal, modeOther) => {
  const modeOriginalPosition = modeAll.indexOf(modeOriginal);
  const modeOtherPosition = modeAll.indexOf(modeOther);

  let position = modeOriginalPosition;
  while (true) {
    position += 1;

    if (position >= modeAll.length) {
      position = -1;
    } else if (position !== modeOtherPosition) {
      break;
    }
  }

  return modeAll[position];
};

const modeAll = ['kana', 'kanji', 'romaji', 'translation'];

type Props = {};
export default class AssessmentMC extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    const correctNumber = (params && params.correctNumber) || 0;
    const total = (params && params.total) || 0;
    return {
      headerTitle: I18n.t('app.common.lesson_no', { lesson_no: params.lesson }),
      headerBackTitle: null,
      headerRight: (
        <Text style={styles.headerRight}>{`${correctNumber} / ${total}`}</Text>
      ),
      headerStyle: {
        backgroundColor: '#F7F7F7',
        borderBottomWidth: 0,
      },
    };
  };

  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          lesson: PropTypes.number.isRequired,
        }).isRequired,
      }).isRequired,
      setParams: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    question: {},
    choices: [],
    modeFrom: 'kana',
    modeTo: 'translation',
    selectedAnswer: -1,
    isCorrect: null,
  };

  componentDidMount() {
    this.getNext();
  }

  componentWillUnmount() {
    Tts.stop();
  }

  getNext = () => {
    const {
      navigation: {
        state: {
          params: { lesson },
        },
      },
    } = this.props;

    const question = choice(vocabularies[lesson].data);

    choices = [question];
    // TODO: use better algorithm
    while (choices.length < 4) {
      temp = choice(vocabularies[lesson].data);

      if (choices.filter(item => item.kana === temp.kana).length === 0) {
        choices.push(temp);
      }
    }

    shuffle(choices);

    this.setState({
      question,
      choices,
      isCorrect: null,
      selectedAnswer: -1,
    });
  };

  nextModeFrom = () => {
    const { modeFrom: modeOriginal, modeTo: modeOther } = this.state;
    this.setState({ modeFrom: getNextMode(modeAll, modeOriginal, modeOther) });
  };

  nextModeTo = () => {
    const { modeFrom: modeOther, modeTo: modeOriginal } = this.state;
    this.setState({ modeTo: getNextMode(modeAll, modeOriginal, modeOther) });
  };

  checkAnswer = (position, correctAnswer, userAnswer) => {
    this.setState({ selectedAnswer: position });
    const { navigation } = this.props;
    const params = navigation.state.params || {};

    const correctNumber = params && params.correctNumber;
    const total = params && params.total;

    const { modeFrom, modeTo } = this.state;

    if (correctAnswer === userAnswer) {
      this.setState({ isCorrect: true });
      navigation.setParams({
        correctNumber: correctNumber ? correctNumber + 1 : 1,
        total: total ? total + 1 : 1,
      });
      tracker.logEvent('assessment-mc-result-correct', {
        answer: userAnswer,
        mode: `${modeFrom} - ${modeTo}`,
      });
    } else {
      this.setState({ isCorrect: false });
      navigation.setParams({ total: total ? total + 1 : 1 });
      tracker.logEvent('assessment-mc-result-incorrect', {
        answer: userAnswer,
        mode: `${modeFrom} - ${modeTo}`,
      });
    }
  };

  render() {
    const {
      navigation: {
        state: {
          params: { lesson },
        },
      },
    } = this.props;

    const { question, choices, modeFrom, modeTo } = this.state;
    const { isCorrect, selectedAnswer } = this.state;

    const displayQuestion =
      modeFrom === 'translation'
        ? I18n.t(`minna.${lesson}.${question.romaji}`)
        : question[modeFrom];
    const displayAnswers = choices.map(
      item =>
        modeTo === 'translation'
          ? I18n.t(`minna.${lesson}.${item.romaji}`)
          : item[modeTo]
    );
    const correctAnswer =
      modeTo === 'translation'
        ? I18n.t(`minna.${lesson}.${question.romaji}`)
        : question[modeTo];

    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity style={styles.mode} onPress={this.nextModeFrom}>
            <Text style={{ color: iOSColors.tealBlue, fontSize: 18 }}>
              {I18n.t(`app.common.${modeFrom}`)}
            </Text>
          </TouchableOpacity>

          <Ionicons
            name="ios-arrow-forward"
            size={16}
            color={iOSColors.tealBlue}
          />

          <TouchableOpacity style={styles.mode} onPress={this.nextModeTo}>
            <Text style={{ color: iOSColors.tealBlue, fontSize: 18 }}>
              {I18n.t(`app.common.${modeTo}`)}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            Tts.setDefaultLanguage('ja');
            Tts.speak(question.kana);
            tracker.logEvent('assessment-mc-read', {
              text: question.kanji,
            });
          }}
        >
          <View style={styles.cardBody}>
            <Text style={styles.cardText}>{displayQuestion}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.tileBlock}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableOpacity
              disabled={selectedAnswer !== -1}
              style={[
                styles.tile,
                {
                  borderColor:
                    selectedAnswer === -1
                      ? 'white'
                      : displayAnswers[0] === correctAnswer
                        ? '#2ECC40'
                        : !isCorrect && selectedAnswer === 0
                          ? '#FF4136'
                          : iOSColors.white,
                },
              ]}
              underlayColor={iOSColors.gray}
              onPress={() =>
                this.checkAnswer(0, correctAnswer, displayAnswers[0], question)
              }
            >
              <Text style={styles.tileText}>{displayAnswers[0]}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={selectedAnswer !== -1}
              style={[
                styles.tile,
                {
                  borderColor:
                    selectedAnswer === -1
                      ? 'white'
                      : displayAnswers[1] === correctAnswer
                        ? '#2ECC40'
                        : !isCorrect && selectedAnswer === 1
                          ? '#FF4136'
                          : iOSColors.white,
                },
              ]}
              underlayColor={iOSColors.gray}
              onPress={() =>
                this.checkAnswer(1, correctAnswer, displayAnswers[1], question)
              }
            >
              <Text style={styles.tileText}>{displayAnswers[1]}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableOpacity
              disabled={selectedAnswer !== -1}
              style={[
                styles.tile,
                {
                  borderColor:
                    selectedAnswer === -1
                      ? 'white'
                      : displayAnswers[2] === correctAnswer
                        ? '#2ECC40'
                        : !isCorrect && selectedAnswer === 2
                          ? '#FF4136'
                          : iOSColors.white,
                },
              ]}
              underlayColor={iOSColors.gray}
              onPress={() =>
                this.checkAnswer(2, correctAnswer, displayAnswers[2], question)
              }
            >
              <Text style={styles.tileText}>{displayAnswers[2]}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={selectedAnswer !== -1}
              style={[
                styles.tile,
                {
                  borderColor:
                    selectedAnswer === -1
                      ? 'white'
                      : displayAnswers[3] === correctAnswer
                        ? '#2ECC40'
                        : !isCorrect && selectedAnswer === 3
                          ? '#FF4136'
                          : iOSColors.white,
                },
              ]}
              underlayColor={iOSColors.gray}
              onPress={() =>
                this.checkAnswer(3, correctAnswer, displayAnswers[3], question)
              }
            >
              <Text style={styles.tileText}>{displayAnswers[3]}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.selectors}>
          <CustomButton
            raised
            title={I18n.t('app.common.next')}
            onPress={() => {
              this.getNext();
              tracker.logEvent('press-assessment-mc-next');
            }}
            titleStyles={{ fontSize: 20 }}
          />

          <SoundButton
            containerStyles={{ marginLeft: 10 }}
            onPress={() => {
              Tts.setDefaultLanguage('ja');
              Tts.speak(question.kana);
              tracker.logEvent('assessment-mc-read', {
                text: question.kanji,
              });
            }}
          />
        </View>

        <AdMob
          unitId={config.admob[`japanese-${Platform.OS}-assessment-mc-banner`]}
        />
      </View>
    );
  }
}
