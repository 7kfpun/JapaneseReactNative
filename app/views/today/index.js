import React, { Component } from 'react';

import {
  Button,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import { SafeAreaView } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import store from 'react-native-simple-store';
// import Swiper from 'react-native-deck-swiper';
import Tts from 'react-native-tts';

import { cleanWord, shuffle } from '../../utils/helpers';

import OutOfConnection from './out-of-connection';

import AdMob from '../../elements/admob';
import Card from '../../elements/card';
import CustomButton from '../../elements/button';
import SoundButton from '../../elements/sound-button';
import CardOptionSelector from '../../elements/card-option-selector';
// import ReadableButton from '../../elements/readable-button';

import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

Tts.setDefaultRate(0.4);
Tts.setDefaultLanguage('ja');
Tts.setDucking(true);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
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
    fontSize: 24,
    fontWeight: '600',
    color: iOSColors.black,
    backgroundColor: 'transparent',
    lineHeight: 40,
  },
  thinText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '300',
    color: iOSColors.black,
    backgroundColor: 'transparent',
    lineHeight: 40,
  },
});

type Props = {};
export default class Today extends Component<Props> {
  static navigationOptions = {
    title: I18n.t('app.today.title'),
    tabBarLabel: I18n.t('app.today.title'),
    tabBarIcon: ({ tintColor, focused }) => <Ionicons name={focused ? 'ios-clipboard' : 'ios-clipboard-outline'} size={19} color={tintColor} />,
  };

  state = {
    isKanaShown: false,
    isKanjiShown: false,
    isRomajiShown: false,
    isTranslationShown: false,
    isSoundOn: false,

    todayItems: [],
    outOfConnection: false,

    cardIndex: 0,
  }

  componentDidMount() {
    store.get('isKanaShown').then(isKanaShown => this.setState({ isKanaShown }));
    store.get('isKanjiShown').then(isKanjiShown => this.setState({ isKanjiShown }));
    store.get('isRomajiShown').then(isRomajiShown => this.setState({ isRomajiShown }));
    store.get('isTranslationShown').then(isTranslationShown => this.setState({ isTranslationShown }));
    store.get('isSoundOn').then(isSoundOn => this.setState({ isSoundOn }));

    this.requestTodayItems();
  }

  componentWillUnmount() {
    Tts.stop();
  }

  requestTodayItems() {
    const URL = `${config.server}/today`;
    fetch(URL)
      .then(res => res.json())
      .then(results => results.data && this.setState({ todayItems: results.data }))
      .then(() => {
        if (this.state.isSoundOn && this.state.todayItems) {
          Tts.stop();
          Tts.setDefaultLanguage('ja');
          Tts.speak(cleanWord(this.state.todayItems[0].kana));
        }
      })
      .catch((err) => {
        console.log('Request for aqi failed', err);
        this.setState({
          outOfConnection: true,
        });
      });
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
      todayItems,
      cardIndex,
      isKanjiShown,
      isKanaShown,
      isRomajiShown,
      isTranslationShown,
      isSoundOn,
    } = this.state;

    const card = todayItems.length > 0 ? todayItems[cardIndex] : null;

    return (
      <SafeAreaView style={styles.container}>
        <CardOptionSelector isOrderedEnable={false} onUpdate={this.updateStates} />

        <View style={{ flex: 1, paddingHorizontal: 26, paddingBottom: 30 }}>
          {this.state.outOfConnection && <OutOfConnection />}
          {!this.state.outOfConnection && card && <Card
            kanji={isKanjiShown && card.kanji}
            kana={isKanaShown && card.kana}
            romaji={isRomajiShown && card.romaji}
            translation={isTranslationShown && I18n.t(`minna.${card.lesson}.${card.romaji}`)}
          />}
        </View>

        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 12,
            paddingHorizontal: 30,
            alignItems: 'center',
          }}
        >
          <CustomButton
            raised
            onPress={() => {
              this.setState({ todayItems: shuffle([...todayItems]) }, () => {
                if (isSoundOn && todayItems) {
                  Tts.stop();
                  Tts.setDefaultLanguage('ja');
                  Tts.speak(cleanWord(todayItems[0].kana));
                }
              });
              tracker.logEvent('user-action-today-shuffle');
            }}
            title={I18n.t('app.today.shuffle')}
            titleStyles={{ fontSize: 18 }}
          />

          <SoundButton
            onPress={() => {
              Tts.setDefaultLanguage('ja');
              Tts.speak(cleanWord(todayItems[cardIndex].kana));
              tracker.logEvent('user-action-today-read');
            }}
          />

          <CustomButton
            raised
            onPress={() => {
              const isLast = cardIndex === todayItems.length - 1;
              this.setState({ cardIndex: isLast ? 0 : cardIndex + 1 }, () => {
                if (isSoundOn) {
                  Tts.setDefaultLanguage('ja');
                  Tts.speak(cleanWord(todayItems[isLast ? 0 : cardIndex + 1].kana));
                }
              });
              tracker.logEvent('user-action-today-next');
            }}
            title={I18n.t('app.assessment.next')}
            titleStyles={{ fontSize: 18 }}
          />
        </View>

        <AdMob unitId={config.admob[`japanese-${Platform.OS}-today-banner`]} />
      </SafeAreaView>
    );
  }
}
