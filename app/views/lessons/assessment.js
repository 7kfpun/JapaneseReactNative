import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import { SafeAreaView } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import store from 'react-native-simple-store';
import Tts from 'react-native-tts';

import { cleanWord, shuffle } from '../../utils/helpers';
import { items as vocabs } from '../../utils/items';
import { hiragana, katakana } from '../../utils/kana';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import AdMob from '../../elements/admob';
import CardOptionSelector from '../../elements/card-option-selector';
import Rating from '../../elements/rating';
import ReadableButton from '../../elements/readable-button';

import { config } from '../../config';

const { width } = Dimensions.get('window');

Tts.setDefaultRate(0.4);
Tts.setDefaultLanguage('ja');
Tts.setDucking(true);

const NO_OF_TILES = 5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerRight: {
    paddingRight: 10,
    color: 'white',
  },
  selectors: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomColor: iOSColors.customGray,
    borderBottomWidth: 0.3,
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
  assessmentBlock: {
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
  },
  tile: {
    justifyContent: 'center',
    alignItems: 'center',
    height: width / NO_OF_TILES,
    width: width / NO_OF_TILES,
    borderWidth: 2,
    borderColor: iOSColors.customGray,
    borderRadius: 3,
  },
  tileText: {
    fontSize: 20,
    fontWeight: '300',
  },
});

type Props = {};
export default class Assessment extends Component<Props> {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          lesson: PropTypes.number.isRequired,
        }).isRequired,
      }).isRequired,
      setParams: PropTypes.func.isRequired,
    }).isRequired,
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    const count = navigation.state && navigation.state.params && navigation.state.params.count;
    const total = navigation.state && navigation.state.params && navigation.state.params.total;
    return {
      headerTitle: I18n.t('app.common.lesson_no', { lesson_no: params.lesson }),
      headerRight: total && <Text style={styles.headerRight}>{`${count + 1} / ${total}`}</Text>,
      tabBarLabel: I18n.t('app.common.lesson_no', { lesson_no: params.lesson }),
      tabBarIcon: ({ tintColor, focused }) => <Ionicons name={focused ? 'ios-list' : 'ios-list-outline'} size={20} color={tintColor} />,
    };
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
  }

  componentDidMount() {
    store.get('isKanjiShown').then(isKanjiShown => this.setState({ isKanjiShown }));
    store.get('isKanaShown').then(isKanaShown => this.setState({ isKanaShown }));
    store.get('isRomajiShown').then(isRomajiShown => this.setState({ isRomajiShown }));
    store.get('isTranslationShown').then(isTranslationShown => this.setState({ isTranslationShown }));
    store.get('isSoundOn').then(isSoundOn => this.setState({ isSoundOn }));
    store.get('isOrdered').then(isOrdered => this.setState({ isOrdered }));

    const { lesson } = this.props.navigation.state.params;
    const total = vocabs[lesson].data.length;

    this.setState({ total });
    this.props.navigation.setParams({ count: 0, total });

    this.getTiles();
  }

  componentWillUnmount() {
    Tts.stop();
  }

  getNext() {
    const rand = Math.floor(Math.random() * this.state.total);
    this.setCount(rand);
  }

  setCount(count) {
    this.props.navigation.setParams({ count });
    this.setState({ count, answers: [] }, () => this.getTiles());
  }

  getTiles() {
    const getRandom = (arr, n) => {
      const result = new Array(n);
      let len = arr.length;
      const taken = new Array(len);
      if (n > len) {
        throw new RangeError('getRandom: more elements taken than available');
      }
      while (n--) {
        const x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
      }
      return result;
    };

    const {
      lesson,
    } = this.props.navigation.state.params;

    const {
      kana,
    } = vocabs[lesson].data[this.state.count];

    const word = cleanWord(kana);

    if (this.state.isSoundOn) {
      Tts.stop();
      Tts.speak(word);
    }

    let length = (NO_OF_TILES * 2) - word.length;
    if (length < 0) {
      length = (NO_OF_TILES * 3) - word.length;
    }
    if (length < 0) {
      this.setState({ tiles: [] });
      return true;
    }

    let tiles;
    if (hiragana.includes(word[0])) {
      tiles = [...getRandom(hiragana, length), ...word];
    } else {
      tiles = [...getRandom(katakana, length), ...word];
    }

    shuffle(tiles);
    this.setState({ tiles });
  }

  read() {
    const {
      lesson,
    } = this.props.navigation.state.params;

    const {
      kana,
    } = vocabs[lesson].data[this.state.count];

    Tts.stop();
    Tts.setDefaultLanguage('ja');
    Tts.speak(cleanWord(kana));
  }

  updateStates = (
    isKanjiShown,
    isKanaShown,
    isRomajiShown,
    isTranslationShown,
    isSoundOn,
  ) => {
    console.log(
      'updateStates',
      isKanjiShown,
      isKanaShown,
      isRomajiShown,
      isTranslationShown,
      isSoundOn,
    );
    this.setState({
      isKanjiShown,
      isKanaShown,
      isRomajiShown,
      isTranslationShown,
      isSoundOn,
    });
  }

  render() {
    const {
      navigation,
      navigation: {
        state: {
          params: {
            lesson,
          },
        },
      },
    } = this.props;

    const {
      kanji,
      kana,
      romaji,
    } = vocabs[lesson].data[this.state.count];

    return (
      <SafeAreaView style={styles.container}>
        <CardOptionSelector onUpdate={this.updateStates} />

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={{ padding: 10 }}
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
            <Ionicons name="ios-help-circle-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.originalBlock}>
            {this.state.isKanjiShown && kanji !== kana && <Text style={styles.originalText}>{kanji}</Text>}
            {this.state.isKanaShown && <Text style={styles.originalText}>{kana}</Text>}
            {this.state.isRomajiShown && <Text style={styles.translationText}>{romaji}</Text>}
          </View>
          <View style={styles.translationBlock}>
            {this.state.isTranslationShown && <Text style={styles.translationText}>{I18n.t(`minna.${lesson}.${romaji}`)}</Text>}
          </View>

          <View style={styles.assessmentBlock}>
            <View style={styles.answerBlock}>
              <View style={styles.answerResult}>
                {this.state.answers.join('') === cleanWord(kana) && <Animatable.View animation="fadeIn">
                  <Ionicons name="md-checkmark" size={28} color="green" />
                </Animatable.View>}
                {!cleanWord(kana).startsWith(this.state.answers.join('')) && <Animatable.View animation="fadeIn">
                  <Ionicons name="md-close" size={28} color="red" />
                </Animatable.View>}
              </View>
              <View style={styles.answerItems}>
                {this.state.answers.map(answer => <Text key={Math.random()} style={styles.answerText}>{answer}</Text>)}
              </View>
              <TouchableOpacity
                style={styles.answerBack}
                onPress={() => {
                  const answers = [...this.state.answers];
                  answers.pop();
                  this.setState({ answers });
                  tracker.logEvent('user-action-press-backspace');
                }}
              >
                {this.state.answers.length > 0 && <Ionicons name="ios-backspace-outline" size={28} color="black" />}
              </TouchableOpacity>

            </View>
            <View style={styles.tileBlock}>
              {this.state.tiles.map(tile => (
                <TouchableOpacity
                  key={Math.random()}
                  onPress={() => {
                    if (this.state.answers.length < cleanWord(kana).length) {
                      this.setState({ answers: [...this.state.answers, tile] }, () => {
                        tracker.logEvent('user-action-press-answer', { tile });

                        if (this.state.answers.join('') === cleanWord(kana)) {
                          tracker.logEvent('user-action-result-correct', { vocab: kana });
                        }

                        if (!cleanWord(kana).startsWith(this.state.answers.join(''))) {
                          tracker.logEvent('user-action-result-incorrect', { vocab: kana });
                        }
                      });
                    }
                  }}
                >
                  <View style={styles.tile}>
                    <Text style={styles.tileText}>{tile}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.selectors}>
          {this.state.isOrdered && <Button
            color={this.state.count > 0 ? iOSColors.black : iOSColors.lightGray}
            title={I18n.t('app.assessment.previous')}
            disabled={this.state.count <= 0}
            onPress={() => {
              this.setCount(this.state.count - 1);
              tracker.logEvent('user-action-press-previous');
            }}
          />}
          {this.state.isOrdered && <Button
            color={this.state.count < this.state.total ? iOSColors.black : iOSColors.lightGray}
            title={I18n.t('app.assessment.next')}
            disabled={this.state.count >= this.state.total - 1}
            onPress={() => {
              this.setCount(this.state.count + 1);
              tracker.logEvent('user-action-press-next', { lesson: `${lesson}` });
            }}
          />}
          {!this.state.isOrdered && <Button
            color={iOSColors.black}
            title={I18n.t('app.assessment.random')}
            disabled={false}
            onPress={() => {
              this.getNext();
              tracker.logEvent('user-action-press-random');
            }}
          />}

          <ReadableButton
            color={iOSColors.black}
            title={I18n.t('app.assessment.read')}
            text={cleanWord(kana)}
            trackEvent={'user-action-press-read'}
          />
        </View>

        {this.state.answers.length > 2 && <Rating />}
        <AdMob unitId={config.admob[`japanese-${Platform.OS}-assessment-banner`]} />
      </SafeAreaView>
    );
  }
}
