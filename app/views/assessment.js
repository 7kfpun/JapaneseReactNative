import React, { Component } from 'react';
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
import Icon from 'react-native-vector-icons/Ionicons';
import Tts from 'react-native-tts';

import { items as vocabs } from '../utils/items';
import { hiragana, katakana } from '../utils/kana';

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
  selectors: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomColor: iOSColors.blue,
    borderBottomWidth: 0.3,
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
    fontSize: 26,
    fontWeight: '500',
    lineHeight: 45,
  },
  translationBlock: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  translationText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '300',
  },
  assessmentBlock: {
  },
  answerBlock: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerResult: {
    flex: 1,
    alignItems: 'center',
  },
  answerItems: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  answerBack: {
    flex: 1,
    alignItems: 'center',
  },
  answerText: {
    textAlign: 'center',
    fontSize: 22,
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
export default class Main extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const count = navigation.state && navigation.state.params && navigation.state.params.count;
    const total = navigation.state && navigation.state.params && navigation.state.params.total;
    return {
      title: '練習',
      headerRight: total && <Text style={{ paddingRight: 10 }}>{`${count + 1} / ${total}`}</Text>,
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
    const { item } = this.props.navigation.state.params;
    const total = vocabs[`lesson${item}`].text.length;
    this.setState({
      vocabs: vocabs[`lesson${item}`].text,
      total,
    });
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
    const { item } = this.props.navigation.state.params;
    const vocab = vocabs[`lesson${item}`].text[this.state.count];

    const kanji = vocab.split(';')[0];
    const japanese = vocab.split(';')[1];
    const en = vocab.split(';')[3];

    return (
      <View style={styles.container}>
        <View style={styles.selectors}>
          <Button
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
            title="順序"
            onPress={() => this.setState({ isOrdered: !this.state.isOrdered })}
          />
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
              <View style={styles.answerBack}>
                {this.state.answers.length > 0 &&
                  <Icon
                    name="ios-backspace-outline"
                    size={28}
                    color="black"
                    onPress={() => {
                      const answers = [...this.state.answers];
                      answers.pop();
                      this.setState({ answers });
                    }}
                  />
                }
              </View>

            </View>
            <View style={styles.tileBlock}>
              {this.state.tiles.map(tile => (
                <TouchableOpacity
                  key={Math.random()}
                  onPress={() => {
                    if (this.state.answers.length < getTestVocab(japanese).length) {
                      this.setState({ answers: [...this.state.answers, tile] });
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
            title="上一個"
            disabled={this.state.count <= 0}
            onPress={() => this.setCount(this.state.count - 1)}
          />}
          {this.state.isOrdered && <Button
            color={this.state.count < this.state.total ? iOSColors.black : iOSColors.lightGray}
            title="下一個"
            disabled={this.state.count >= this.state.total - 1}
            onPress={() => this.setCount(this.state.count + 1)}
          />}
          {!this.state.isOrdered && <Button
            color={iOSColors.black}
            title="隨機"
            disabled={false}
            onPress={() => this.getNext()}
          />}

          <Button
            color={iOSColors.black}
            title="閱讀"
            onPress={() => this.read()}
          />
        </View>
        <AdMob unitId={config.admob[Platform.OS].banner} />
      </View>
    );
  }
}
