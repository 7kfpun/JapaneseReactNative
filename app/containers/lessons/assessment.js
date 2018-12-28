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
import firebase from 'react-native-firebase';
import store from 'react-native-simple-store';
import Tts from 'react-native-tts';

import { cleanWord, shuffle, ttsSpeak } from '../../utils/helpers';
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

const advert = firebase
  .admob()
  .interstitial(config.admob[`japanese-${Platform.OS}-assessment-popup`]);

const { AdRequest } = firebase.admob;
const request = new AdRequest();
request
  .addKeyword('study')
  .addKeyword('japanese')
  .addKeyword('travel');

advert.loadAd(request.build());

advert.on('onAdLoaded', () => {
  console.log('Advert ready to show.');
});

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
    color: iOSColors.gray,
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
    count: 0,
    isKanjiShown: true,
    isKanaShown: true,
    isTranslationShown: true,
    isSoundOn: true,
    isOrdered: true,
    tiles: [],
    answers: [],
  };

  componentDidMount() {
    this.loadSettings();
    this.loadPopupAd();
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

    const vocabulary = vocabularies[lesson].data[count];
    const { kana } = vocabulary;

    const cleanKana = cleanWord(kana);

    if (isSoundOn) {
      ttsSpeak(vocabulary);
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

  loadSettings = async () => {
    const isKanjiShown = await store.get('isKanjiShown');
    const isKanaShown = await store.get('isKanaShown');
    const isRomajiShown = await store.get('isRomajiShown');
    const isTranslationShown = await store.get('isTranslationShown');
    const isSoundOn = await store.get('isSoundOn');
    const isOrdered = await store.get('isOrdered');

    this.setState({
      isKanjiShown,
      isKanaShown,
      isRomajiShown,
      isTranslationShown,
      isSoundOn,
      isOrdered,
    });

    this.getTotal();
    this.getTiles();
  };

  loadPopupAd() {
    const {
      navigation: {
        state: {
          params: { lesson },
        },
      },
    } = this.props;

    store.get('adFreeUntil').then(adFreeUntil => {
      if (
        !__DEV__ &&
        !(adFreeUntil && adFreeUntil > getTimestamp()) &&
        advert.isLoaded() &&
        lesson > 3 &&
        Math.random() < 0.7
      ) {
        advert.show();
        tracker.logEvent('app-assessment-popup');
      }
    });
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

    ttsSpeak(vocabularies[lesson].data[count]);
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

    const vocabulary = vocabularies[lesson].data[count];
    const { kanji, kana, romaji } = vocabulary;

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
                tracker.logEvent('press-backspace');
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
                      tracker.logEvent('press-answer', { tile });

                      const { answers: newAnswers } = this.state;

                      if (newAnswers.join('') === cleanWord(kana)) {
                        tracker.logEvent('result-correct', {
                          vocab: kana,
                        });
                        console.log('correct');
                      }

                      if (!cleanWord(kana).startsWith(newAnswers.join(''))) {
                        tracker.logEvent('result-incorrect', {
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
                  tracker.logEvent('press-previous');
                }}
                titleStyles={{ fontSize: 20 }}
              />

              <SoundButton
                containerStyles={{ marginHorizontal: 15 }}
                onPress={() => {
                  ttsSpeak(vocabulary);
                  tracker.logEvent('assessment-read');
                }}
              />

              <CustomButton
                raised
                title={I18n.t('app.common.next')}
                disabled={count >= total - 1}
                onPress={() => {
                  this.setCount(count + 1);
                  tracker.logEvent('press-next', {
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
                  tracker.logEvent('press-random');
                }}
                titleStyles={{ fontSize: 20 }}
              />

              <SoundButton
                containerStyles={{ marginLeft: 10 }}
                onPress={() => {
                  ttsSpeak(vocabulary);
                  tracker.logEvent('assessment-read');
                }}
              />
            </Fragment>
          )}
        </View>

        {answers.length > 3 && <Rating />}

        <AdMob
          unitId={config.admob[`japanese-${Platform.OS}-assessment-banner`]}
        />
      </View>
    );
  }
}
