import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import store from 'react-native-simple-store';
import Tts from 'react-native-tts';

import { cleanWord, shuffle } from '../../utils/helpers';
import { items as vocabularies } from '../../utils/items';
import { hiragana, katakana } from '../../utils/kana';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import AdMob from '../../components/admob';
import Card from '../../components/card';
import CardOptionSelector from '../../components/card-option-selector';
import CustomButton from '../../components/button';
import Rating from '../../components/rating';
import SoundButton from '../../components/sound-button';

import { config } from '../../config';

const { width } = Dimensions.get('window');

Tts.setDefaultLanguage('ja');

const NO_OF_TILES = 5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  headerRight: {
    paddingRight: 10,
    color: iOSColors.white,
  },
  selectors: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  selectorIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 18,
    textAlign: 'center',
  },
  originalBlock: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  originalText: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '900',
    color: iOSColors.black,
    lineHeight: 40,
  },
  translationBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  translationText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '300',
    color: iOSColors.black,
  },
  answerBlock: {
    height: 50,
    flexDirection: 'row',
  },
  answerResult: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerItems: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '500',
    padding: 2,
    textDecorationLine: 'underline',
  },
  tileBlock: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  tile: {
    justifyContent: 'center',
    alignItems: 'center',
    height: (width - 160) / NO_OF_TILES,
    width: (width - 130) / NO_OF_TILES,
    backgroundColor: iOSColors.white,
    marginTop: 10,
  },
  tileText: {
    fontSize: 20,
    fontWeight: '300',
  },
});

const getRandom = (arr, n) => {
  const result = new Array(n);
  let len = arr.length;
  const taken = new Array(len);
  if (n > len) {
    throw new RangeError('getRandom: more elements taken than available');
  }
  while (n--) {
    // eslint-disable-line no-plusplus, no-param-reassign
    const x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len; // eslint-disable-line no-plusplus
  }
  return result;
};

type Props = {};
export default class Assessment extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    const count = params && params.count;
    const total = params && params.total;
    return {
      headerTitle: I18n.t('app.common.lesson_no', { lesson_no: params.lesson }),
      headerBackTitle: null,
      headerRight: total && (
        <Text style={styles.headerRight}>{`${count + 1} / ${total}`}</Text>
      ),
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
    count: 0,
    isKanjiShown: true,
    isKanaShown: true,
    isTranslationShown: true,
    isSoundOn: true,
    isOrdered: true,
    tiles: [],
    answers: [],
    isPremium: false,
  };

  componentDidMount() {
    store
      .get('isKanjiShown')
      .then(isKanjiShown => this.setState({ isKanjiShown }));
    store
      .get('isKanaShown')
      .then(isKanaShown => this.setState({ isKanaShown }));
    store
      .get('isRomajiShown')
      .then(isRomajiShown => this.setState({ isRomajiShown }));
    store
      .get('isTranslationShown')
      .then(isTranslationShown => this.setState({ isTranslationShown }));
    store
      .get('isSoundOn')
      .then(isSoundOn => this.setState({ isSoundOn }))
      .then(() => {
        this.getTotal();
        this.getTiles();
      });

    store.get('isOrdered').then(isOrdered => this.setState({ isOrdered }));

    store.get('isPremium').then(isPremium => this.setState({ isPremium }));
  }

  componentWillUnmount() {
    Tts.stop();
  }

  getNext() {
    const { total } = this.state;
    const rand = Math.floor(Math.random() * total);
    this.setCount(rand);
  }

  setCount(count) {
    const { navigation } = this.props;
    navigation.setParams({ count });
    this.setState({ count, answers: [] }, () => this.getTiles());
  }

  getTiles() {
    const {
      navigation: {
        state: {
          params: { lesson },
        },
      },
    } = this.props;

    const { isSoundOn, count } = this.state;

    const { kana } = vocabularies[lesson].data[count];

    const cleanKana = cleanWord(kana);

    if (isSoundOn) {
      Tts.stop();
      Tts.speak(cleanWord(kana));
    }

    let length = NO_OF_TILES * 2 - cleanKana.length;
    if (length < 0) {
      length = NO_OF_TILES * 3 - cleanKana.length;
    }
    if (length < 0) {
      this.setState({ tiles: [] });
      return true;
    }

    let tiles;
    if (hiragana.includes(cleanKana[0])) {
      tiles = [...getRandom(hiragana, length), ...cleanKana.split('')];
    } else {
      tiles = [...getRandom(katakana, length), ...cleanKana.split('')];
    }

    shuffle(tiles);
    this.setState({ tiles });
  }

  getTotal() {
    const {
      navigation: {
        state: {
          params: { lesson },
        },
      },
      navigation,
    } = this.props;

    const total = vocabularies[lesson].data.length;

    this.setState({ total });
    navigation.setParams({ count: 0, total });
  }

  updateStates = (
    isKanjiShown,
    isKanaShown,
    isRomajiShown,
    isTranslationShown,
    isSoundOn,
    isOrdered
  ) => {
    console.log(
      'updateStates',
      isKanjiShown,
      isKanaShown,
      isRomajiShown,
      isTranslationShown,
      isSoundOn,
      isOrdered
    );
    this.setState({
      isKanjiShown,
      isKanaShown,
      isRomajiShown,
      isTranslationShown,
      isSoundOn,
      isOrdered,
    });
  };

  read() {
    const {
      navigation: {
        state: {
          params: { lesson },
        },
      },
    } = this.props;

    const { count } = this.state;

    const { kana } = vocabularies[lesson].data[count];

    Tts.stop();
    Tts.setDefaultLanguage('ja');
    Tts.speak(cleanWord(kana));
  }

  render() {
    const {
      navigation,
      navigation: {
        state: {
          params: { lesson },
        },
      },
    } = this.props;

    const { isPremium } = this.state;

    const {
      isKanjiShown,
      isKanaShown,
      isRomajiShown,
      isTranslationShown,

      isOrdered,
      count,
      total,
      answers,
      tiles,
    } = this.state;

    const { kanji, kana, romaji } = vocabularies[lesson].data[count];

    return (
      <View style={styles.container}>
        <CardOptionSelector onUpdate={this.updateStates} />

        <View
          style={{
            flex: 1,
            paddingHorizontal: 26,
            paddingBottom: Platform.OS === 'ios' ? 30 : 0,
          }}
        >
          <View style={{ flex: 2 }}>
            <Card
              navigation={navigation}
              lesson={lesson}
              kanji={kanji}
              kana={kana}
              romaji={romaji}
              translation={I18n.t(`minna.${lesson}.${romaji}`)}
              isKanjiShown={isKanjiShown}
              isKanaShown={isKanaShown}
              isRomajiShown={isRomajiShown}
              isTranslationShown={isTranslationShown}
              answers={answers}
              removeAnswer={() => {
                const tempAnswers = [...answers];
                tempAnswers.pop();
                this.setState({ answers: tempAnswers });
                tracker.logEvent('user-action-press-backspace');
              }}
            />
          </View>

          <View style={styles.tileBlock}>
            {tiles.map(tile => (
              <TouchableHighlight
                underlayColor={iOSColors.midGray}
                style={styles.tile}
                key={Math.random()}
                onPress={() => {
                  if (answers.length < cleanWord(kana).length) {
                    this.setState({ answers: [...answers, tile] }, () => {
                      tracker.logEvent('user-action-press-answer', { tile });

                      const { answers: newAnswers } = this.state;

                      if (newAnswers.join('') === cleanWord(kana)) {
                        tracker.logEvent('user-action-result-correct', {
                          vocab: kana,
                        });
                        console.log('correct');
                      }

                      if (!cleanWord(kana).startsWith(newAnswers.join(''))) {
                        tracker.logEvent('user-action-result-incorrect', {
                          vocab: kana,
                        });
                        console.log('incorrect');
                      }
                    });
                  }
                }}
              >
                <Text style={styles.tileText}>{tile}</Text>
              </TouchableHighlight>
            ))}
          </View>
        </View>

        <View style={styles.selectors}>
          {isOrdered && (
            <Fragment>
              <CustomButton
                raised
                title={I18n.t('app.common.previous')}
                disabled={count <= 0}
                onPress={() => {
                  this.setCount(count - 1);
                  tracker.logEvent('user-action-press-previous');
                }}
                titleStyles={{ fontSize: 20 }}
              />

              <SoundButton
                containerStyles={{ marginHorizontal: 15 }}
                onPress={() => {
                  Tts.setDefaultLanguage('ja');
                  Tts.speak(cleanWord(kana));
                  tracker.logEvent('user-action-assessment-read');
                }}
              />

              <CustomButton
                raised
                title={I18n.t('app.common.next')}
                disabled={count >= total - 1}
                onPress={() => {
                  this.setCount(count + 1);
                  tracker.logEvent('user-action-press-next', {
                    lesson: `${lesson}`,
                  });
                }}
                titleStyles={{ fontSize: 20 }}
              />
            </Fragment>
          )}

          {!isOrdered && (
            <Fragment>
              <CustomButton
                raised
                title={I18n.t('app.common.random')}
                onPress={() => {
                  this.getNext();
                  tracker.logEvent('user-action-press-random');
                }}
                titleStyles={{ fontSize: 20 }}
              />

              <SoundButton
                containerStyles={{ marginLeft: 10 }}
                onPress={() => {
                  Tts.setDefaultLanguage('ja');
                  Tts.speak(cleanWord(kana));
                  tracker.logEvent('user-action-assessment-read');
                }}
              />
            </Fragment>
          )}
        </View>

        {answers.length > 2 && <Rating />}

        {!isPremium && (
          <AdMob
            unitId={config.admob[`japanese-${Platform.OS}-assessment-banner`]}
          />
        )}
      </View>
    );
  }
}
