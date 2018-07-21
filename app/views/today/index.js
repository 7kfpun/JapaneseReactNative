import React, { Component } from 'react';

import {
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import { SafeAreaView } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import store from 'react-native-simple-store';
import Swiper from 'react-native-deck-swiper';
import Tts from 'react-native-tts';

import { cleanWord, shuffle } from '../../utils/helpers';

import AdMob from '../../elements/admob';
import CardOptionSelector from '../../elements/card-option-selector';
import ReadableButton from '../../elements/readable-button';

import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

Tts.setDefaultRate(0.4);
Tts.setDefaultLanguage('ja');
Tts.setDucking(true);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 10,
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
    tabBarIcon: ({ tintColor, focused }) => <Ionicons name={focused ? 'ios-clipboard' : 'ios-clipboard-outline'} size={20} color={tintColor} />,
  };

  state = {
    isKanaShown: false,
    isKanjiShown: false,
    isRomajiShown: false,
    isTranslationShown: false,
    isSoundOn: false,

    todayItems: [],
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
        if (this.state.isSoundOn) {
          Tts.stop();
          Tts.speak(cleanWord(this.state.todayItems[0].kana));
        }
      })
      .catch((err) => {
        console.log('Request for aqi failed', err);
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
    return (
      <SafeAreaView style={styles.container}>
        <CardOptionSelector isOrderedEnable={false} onUpdate={this.updateStates} />

        <View style={{ flex: 1 }}>
          <Swiper
            key={
              `${this.state.isKanjiShown}${this.state.isKanaShown}${this.state.isRomajiShown}${this.state.isTranslationShown}${this.state.isSoundOn}`
            }
            cards={this.state.todayItems}
            renderCard={card => (
              <View style={styles.card}>
                <View>
                  {this.state.isKanjiShown && card.kanji !== card.kana && <Text style={styles.text}>{card.kanji}</Text>}
                  {this.state.isKanaShown && <Text style={styles.text}>{card.kana}</Text>}
                  {this.state.isRomajiShown && <Text style={styles.thinText}>{card.romaji}</Text>}
                  {this.state.isTranslationShown && <Text style={styles.thinText}>{I18n.t(`minna.${card.romaji}`)}</Text>}
                </View>

                <ReadableButton
                  title={I18n.t('app.assessment.read')}
                  text={cleanWord(card.kana)}
                  trackEvent={'user-action-press-today-read'}
                />
              </View>
            )}
            onTapCard={(cardIndex) => {
              Tts.stop();
              Tts.speak(cleanWord(this.state.todayItems[cardIndex].kana));
            }}
            onSwiped={(cardIndex) => {
              if (this.state.isSoundOn) {
                setTimeout(() => {
                  Tts.stop();
                  if (cardIndex + 1 < this.state.todayItems.length) {
                    Tts.speak(cleanWord(this.state.todayItems[cardIndex + 1].kana));
                  } else {
                    Tts.speak(cleanWord(this.state.todayItems[0].kana));
                  }
                });
              }

              tracker.logEvent('user-action-swipe', { value: cardIndex });
            }}
            onSwipedAll={() => tracker.logEvent('user-action-swipe-all')}
            cardVerticalMargin={Platform.OS === 'ios' ? 40 : 50}
            backgroundColor={iOSColors.customGray}
            stackSize={3}
            marginBottom={Platform.OS === 'ios' ? 170 : 20}
            infinite
          >
            <Button
              onPress={() => {
                this.setState({ todayItems: shuffle([...this.state.todayItems]) }, () => {
                  if (this.state.isSoundOn) {
                    Tts.stop();
                    Tts.speak(cleanWord(this.state.todayItems[0].kana));
                  }
                });
                tracker.logEvent('user-action-today-shuffle');
              }}
              title="Shuffle"
            />
          </Swiper>
        </View>

        <AdMob unitId={config.admob[`japanese-${Platform.OS}-today-banner`]} />
      </SafeAreaView>
    );
  }
}
