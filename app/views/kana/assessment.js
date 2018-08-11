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
import { SafeAreaView } from 'react-navigation';
import Tts from 'react-native-tts';
import store from 'react-native-simple-store';

import { choice, randomInt } from '../../utils/helpers';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import AdMob from '../../elements/admob';
import CustomButton from '../../elements/button';
import SoundButton from '../../elements/sound-button';

import { config } from '../../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  headerRight: {
    paddingRight: 10,
    color: iOSColors.white,
  },
  card: {
    flex: 2,
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
  tileBlock: {
    flex: 1,
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
  },
  tileText: {
    fontSize: 20,
    fontWeight: '300',
  },
  selectors: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
});

type Props = {};
export default class KanaAssessment extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    const correctNumber = (params && params.correctNumber) || 0;
    const total = params && params.total;
    return {
      headerTitle: I18n.t(`app.kana.${params.mode}`),
      headerRight: (
        <Text style={styles.headerRight}>{`${correctNumber} / ${total}`}</Text>
      ),
      tabBarLabel: I18n.t(`app.kana.${params.mode}`),
      tabBarIcon: ({ tintColor, focused }) => (
        <Text
          style={[
            styles.tabText,
            { color: focused ? tintColor : iOSColors.black },
          ]}
        >
          {'あ'}
        </Text>
      ),
    };
  };

  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({}).isRequired,
      }).isRequired,
      setParams: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    origin: [],
    choices: [],
    modeFrom: 'hiragana',
    modeTo: 'romaji',
    modeOther: 'katakana',
    answerPosition: -1,
    isCorrect: null,
    isPremium: false,
  };

  componentDidMount() {
    this.getNext();

    store.get('isPremium').then(isPremium => this.setState({ isPremium }));
  }

  componentWillUnmount() {
    Tts.stop();
  }

  getNext = () => {
    const {
      navigation: {
        state: {
          params: { kana },
        },
      },
    } = this.props;

    let origin;
    while (true) {
      origin = choice(choice(kana));
      if (origin[0] !== '') {
        break;
      }
    }

    choices = [];
    while (true) {
      temp = choice(choice(kana));

      if (choices.length === 3) {
        break;
      }

      if (origin[0] !== temp[0] && temp[0] !== '') {
        choices.push(temp);
      }
    }

    choices.splice(randomInt(4), 0, origin);

    this.setState({
      origin,
      choices,
      isCorrect: null,
      answerPosition: -1,
    });
  };

  swapModeFrom = () => {
    const { modeFrom: tempModeFrom, modeOther } = this.state;
    this.setState({ modeFrom: modeOther, modeOther: tempModeFrom });
  };

  swapModeTo = () => {
    const { modeTo: tempModeTo, modeOther } = this.state;
    this.setState({ modeTo: modeOther, modeOther: tempModeTo });
  };

  checkAnswer = (position, rightAnswer, userAnswer, origin) => {
    this.setState({ answerPosition: position });
    const { navigation } = this.props;
    const params = navigation.state.params || {};

    const correctNumber = params && params.correctNumber;
    const total = params && params.total;

    if (rightAnswer === userAnswer) {
      this.setState({ isCorrect: true });
      navigation.setParams({
        correctNumber: correctNumber + 1,
        total: total + 1,
      });
      store.save(`kana.assessment.${origin[2]}`, true);
      tracker.logEvent('user-action-kana-assessment-result-correct');
    } else {
      this.setState({ isCorrect: false });
      navigation.setParams({ total: total + 1 });
      store.save(`kana.assessment.${origin[2]}`, false);
      tracker.logEvent('user-action-kana-assessment-result-incorrect');
    }
    store.save(
      `kana.assessment.${origin[2]}.timestamp`,
      parseInt(Date.now() / 1000, 10)
    );
  };

  render() {
    const { isPremium } = this.state;

    const { origin, choices, modeFrom, modeTo } = this.state;
    const { isCorrect, answerPosition } = this.state;

    const l = {
      hiragana: 0,
      katakana: 1,
      romaji: 2,
    };
    const question = origin[l[modeFrom]];
    const rightAnswer = origin[l[modeTo]];

    const answers = choices.map(item => item[l[modeTo]]);

    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 8,
            }}
            onPress={this.swapModeFrom}
          >
            <Text style={{ color: iOSColors.tealBlue, fontSize: 18 }}>
              {I18n.t(`app.kana.${modeFrom}`)}
            </Text>
          </TouchableOpacity>

          <Text style={{ color: iOSColors.tealBlue }}>{'->'}</Text>

          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 8,
            }}
            onPress={this.swapModeTo}
          >
            <Text style={{ color: iOSColors.tealBlue, fontSize: 18 }}>
              {I18n.t(`app.kana.${modeTo}`)}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            Tts.setDefaultLanguage('ja');
            Tts.speak(origin[0]);
            tracker.logEvent('user-action-kana-assessment-read');
          }}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 16,
              backgroundColor: iOSColors.white,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 60 }}>{question}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.tileBlock}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableOpacity
              disabled={answerPosition !== -1}
              style={[
                styles.tile,
                {
                  borderColor:
                    answerPosition === -1
                      ? 'white'
                      : answers[0] === rightAnswer
                        ? '#2ECC40'
                        : !isCorrect && answerPosition === 0
                          ? '#FF4136'
                          : iOSColors.white,
                },
              ]}
              underlayColor={iOSColors.gray}
              onPress={() =>
                this.checkAnswer(0, rightAnswer, answers[0], origin)
              }
            >
              <Text style={styles.tileText}>{answers[0]}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={answerPosition !== -1}
              style={[
                styles.tile,
                {
                  borderColor:
                    answerPosition === -1
                      ? 'white'
                      : answers[1] === rightAnswer
                        ? '#2ECC40'
                        : !isCorrect && answerPosition === 1
                          ? '#FF4136'
                          : iOSColors.white,
                },
              ]}
              underlayColor={iOSColors.gray}
              onPress={() =>
                this.checkAnswer(1, rightAnswer, answers[1], origin)
              }
            >
              <Text style={styles.tileText}>{answers[1]}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableOpacity
              disabled={answerPosition !== -1}
              style={[
                styles.tile,
                {
                  borderColor:
                    answerPosition === -1
                      ? 'white'
                      : answers[2] === rightAnswer
                        ? '#2ECC40'
                        : !isCorrect && answerPosition === 2
                          ? '#FF4136'
                          : iOSColors.white,
                },
              ]}
              underlayColor={iOSColors.gray}
              onPress={() =>
                this.checkAnswer(2, rightAnswer, answers[2], origin)
              }
            >
              <Text style={styles.tileText}>{answers[2]}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={answerPosition !== -1}
              style={[
                styles.tile,
                {
                  borderColor:
                    answerPosition === -1
                      ? 'white'
                      : answers[3] === rightAnswer
                        ? '#2ECC40'
                        : !isCorrect && answerPosition === 3
                          ? '#FF4136'
                          : iOSColors.white,
                },
              ]}
              underlayColor={iOSColors.gray}
              onPress={() =>
                this.checkAnswer(3, rightAnswer, answers[3], origin)
              }
            >
              <Text style={styles.tileText}>{answers[3]}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.selectors}>
          <CustomButton
            raised
            title={I18n.t('app.common.next')}
            onPress={() => {
              this.getNext();
              tracker.logEvent('user-action-press-kana-assessment-next');
            }}
            titleStyles={{ fontSize: 20 }}
          />

          <SoundButton
            containerStyles={{ marginLeft: 10 }}
            onPress={() => {
              Tts.setDefaultLanguage('ja');
              Tts.speak(origin[0]);
              tracker.logEvent('user-action-kana-assessment-read');
            }}
          />
        </View>

        {!isPremium && (
          <AdMob unitId={config.admob[`japanese-${Platform.OS}-kana-banner`]} />
        )}
      </SafeAreaView>
    );
  }
}
