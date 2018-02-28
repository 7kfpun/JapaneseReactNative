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
import Icon from 'react-native-vector-icons/Ionicons';
import store from 'react-native-simple-store';
import Tts from 'react-native-tts';

import { items as vocabs } from '../utils/items';
import { hiragana, katakana } from '../utils/kana';
import tracker from '../utils/tracker';

import AdMob from '../elements/admob';

import { config } from '../config';

const { width } = Dimensions.get('window');

Tts.setDefaultRate(0.3);
Tts.setDefaultLanguage('ja');
Tts.setDucking(true);

const NO_OF_TILES = 5;

const getTestVocab = text => text
  .replace(/（.*?）/g, '')
  .replace(/［.*?］/g, '')
  .replace(/「.*?」/g, '')
  .replace(/～/g, '')
  .replace(/。/g, '');

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
    borderBottomColor: iOSColors.blue,
    borderBottomWidth: 0.3,
  },
  selectorIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 16,
    paddingBottom: 6,
  },
  originalBlock: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  originalText: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 55,
  },
  translationBlock: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  translationText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '300',
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
// LessonList
export default class Assessment extends Component<Props> {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          item: PropTypes.number.isRequired,
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
      headerTitle: `Lesson ${params.item}`,
      headerRight: total && <Text style={styles.headerRight}>{`${count + 1} / ${total}`}</Text>,
    };
  };

  state = {
    count: 0,
    isJapaneseShown: true,
    isKanjiShown: true,
    isTranslationShown: true,
    isSoundOn: true,
    isOrdered: true,
    tiles: [],
    answers: [],
  }

  componentDidMount() {
    const that = this;
    store.get('notFirstStart').then((notFirstStart) => {
      if (notFirstStart) {
        store.get('isJapaneseShown').then(isJapaneseShown => that.setState({ isJapaneseShown }));
        store.get('isKanjiShown').then(isKanjiShown => that.setState({ isKanjiShown }));
        store.get('isTranslationShown').then(isTranslationShown => that.setState({ isTranslationShown }));
        store.get('isSoundOn').then(isSoundOn => that.setState({ isSoundOn }));
        store.get('isOrdered').then(isOrdered => that.setState({ isOrdered }));
      } else {
        store.save('isJapaneseShown', true);
        store.save('isKanjiShown', true);
        store.save('isTranslationShown', true);
        store.save('isSoundOn', true);
        store.save('isOrdered', true);
        store.save('notFirstStart', true);
        that.setState({ isJapaneseShown: true });
        that.setState({ isKanjiShown: true });
        that.setState({ isTranslationShown: true });
        that.setState({ isSoundOn: true });
        that.setState({ isOrdered: true });
      }
    });

    const { item } = this.props.navigation.state.params;
    const total = vocabs[`lesson${item}`].text.length;
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

    const shuffle = (a) => {
      let j;
      let x;
      let i;
      for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
      }
    };

    const { item } = this.props.navigation.state.params;
    const vocab = vocabs[`lesson${item}`].text[this.state.count];
    const japanese = getTestVocab(vocab.split(';')[1]);
    let length = (NO_OF_TILES * 2) - japanese.length;
    if (length < 0) {
      length = (NO_OF_TILES * 3) - japanese.length;
    }

    if (this.state.isSoundOn) {
      Tts.stop();
      Tts.speak(japanese);
    }

    let tiles;
    if (hiragana.includes(japanese[0])) {
      tiles = [...getRandom(hiragana, length), ...japanese];
    } else {
      tiles = [...getRandom(katakana, length), ...japanese];
    }

    shuffle(tiles);
    this.setState({ tiles });
  }

  read() {
    const { item } = this.props.navigation.state.params;
    const vocab = vocabs[`lesson${item}`].text[this.state.count];
    const japanese = getTestVocab(vocab.split(';')[1]);

    Tts.stop();
    Tts.speak(japanese);
  }

  render() {
    tracker.view('assessment');
    const { item } = this.props.navigation.state.params;
    const vocab = vocabs[`lesson${item}`].text[this.state.count];

    const kanji = vocab.split(';')[0];
    const japanese = vocab.split(';')[1];
    const en = vocab.split(';')[3];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.selectors}>
          <TouchableOpacity
            style={styles.selectorIcon}
            onPress={() => this.setState({
              isJapaneseShown: !this.state.isJapaneseShown,
            }, () => {
              store.save('isJapaneseShown', this.state.isJapaneseShown);
              tracker.logEvent('user-action-set-isJapaneseShown', { value: this.state.isJapaneseShown });
            })}
          >
            <Text style={{ fontSize: 18, color: this.state.isJapaneseShown ? iOSColors.black : iOSColors.lightGray }}>日</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.selectorIcon}
            onPress={() => this.setState({
              isKanjiShown: !this.state.isKanjiShown,
            }, () => {
              store.save('isKanjiShown', this.state.isKanjiShown);
              tracker.logEvent('user-action-set-isKanjiShown', { value: this.state.isKanjiShown });
            })}
          >
            <Text style={{ fontSize: 18, color: this.state.isKanjiShown ? iOSColors.black : iOSColors.lightGray }}>漢</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.selectorIcon}
            onPress={() => this.setState({
              isTranslationShown: !this.state.isTranslationShown,
            }, () => {
              store.save('isTranslationShown', this.state.isTranslationShown);
              tracker.logEvent('user-action-set-isKanjiShown', { value: this.state.isKanjiShown });
            })}
          >
            <Text style={{ fontSize: 18, color: this.state.isTranslationShown ? iOSColors.black : iOSColors.lightGray }}>ENG</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.selectorIcon}
            onPress={() => this.setState({
              isSoundOn: !this.state.isSoundOn,
            }, () => {
              store.save('isSoundOn', this.state.isSoundOn);
              tracker.logEvent('user-action-set-isKanjiShown', { value: this.state.isKanjiShown });
            })}
          >
            <Icon name={this.state.isSoundOn ? 'ios-volume-up' : 'ios-volume-off'} size={28} color={this.state.isSoundOn ? iOSColors.black : iOSColors.lightGray} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.selectorIcon}
            onPress={() => this.setState({
              isOrdered: !this.state.isOrdered,
            }, () => {
              store.save('isOrdered', this.state.isOrdered);
              tracker.logEvent('user-action-set-isKanjiShown', { value: this.state.isKanjiShown });
            })}
          >
            <Icon name={this.state.isOrdered ? 'ios-shuffle' : 'ios-list'} size={28} color="black" />
          </TouchableOpacity>

          {/* <Button
            color={this.state.isJapaneseShown ? iOSColors.black : iOSColors.lightGray}
            title="日文"
            onPress={() => this.setState({ isJapaneseShown: !this.state.isJapaneseShown })}
          />
          <Button
            color={this.state.isKanjiShown ? iOSColors.black : iOSColors.lightGray}
            title="漢字"
            onPress={() => this.setState({ isKanjiShown: !this.state.isKanjiShown })}
          />
          <Button
            color={this.state.isTranslationShown ? iOSColors.black : iOSColors.lightGray}
            title="翻譯"
            onPress={() => this.setState({ isTranslationShown: !this.state.isTranslationShown })}
          />
          <Button
            color={this.state.isSoundOn ? iOSColors.black : iOSColors.lightGray}
            title="聽力"
            onPress={() => this.setState({ isSoundOn: !this.state.isSoundOn })}
          />
          <Button
            color={this.state.isOrdered ? iOSColors.black : iOSColors.lightGray}
            title={this.state.isOrdered ? '順序' : '隨機'}
            onPress={() => this.setState({ isOrdered: !this.state.isOrdered })}
          /> */}
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.originalBlock}>
            {this.state.isKanjiShown && kanji !== japanese && <Text style={styles.originalText}>{kanji}</Text>}
            {this.state.isJapaneseShown && <Text style={styles.originalText}>{japanese}</Text>}
          </View>
          <View style={styles.translationBlock}>
            {this.state.isTranslationShown && <Text style={styles.translationText}>{en}</Text>}
          </View>
          <View style={styles.assessmentBlock}>
            <View style={styles.answerBlock}>
              <View style={styles.answerResult}>
                {this.state.answers.join('') === getTestVocab(japanese) && <Icon name="md-checkmark" size={28} color="green" />}
                {!getTestVocab(japanese).startsWith(this.state.answers.join('')) && <Icon name="md-close" size={28} color="red" />}
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
                {this.state.answers.length > 0 && <Icon name="ios-backspace-outline" size={28} color="black" />}
              </TouchableOpacity>

            </View>
            <View style={styles.tileBlock}>
              {this.state.tiles.map(tile => (
                <TouchableOpacity
                  key={Math.random()}
                  onPress={() => {
                    if (this.state.answers.length < getTestVocab(japanese).length) {
                      this.setState({ answers: [...this.state.answers, tile] });
                      tracker.logEvent('user-action-press-answer');
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
            title="Previous"
            disabled={this.state.count <= 0}
            onPress={() => {
              this.setCount(this.state.count - 1);
              tracker.logEvent('user-action-press-previous');
            }}
          />}
          {this.state.isOrdered && <Button
            color={this.state.count < this.state.total ? iOSColors.black : iOSColors.lightGray}
            title="Next"
            disabled={this.state.count >= this.state.total - 1}
            onPress={() => {
              this.setCount(this.state.count + 1);
              tracker.logEvent('user-action-press-next');
            }}
          />}
          {!this.state.isOrdered && <Button
            color={iOSColors.black}
            title="Random"
            disabled={false}
            onPress={() => {
              this.getNext();
              tracker.logEvent('user-action-press-random');
            }}
          />}

          <Button
            color={iOSColors.black}
            title="Read"
            onPress={() => {
              this.read();
              tracker.logEvent('user-action-press-read');
            }}
          />
        </View>
        <AdMob unitId={config.admob[`japanese-${Platform.OS}-assessment-banner`]} />
      </SafeAreaView>
    );
  }
}
