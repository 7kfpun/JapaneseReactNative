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
import Swiper from 'react-native-deck-swiper';

import { shuffle, cleanWord } from '../../utils/helpers';

import AdMob from '../../elements/admob';
import ReadableButton from '../../elements/readable-button';

import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

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
    todayItems: [],
  }

  componentDidMount() {
    this.requestTodayItems();
  }

  requestTodayItems() {
    const URL = `${config.server}/today`;
    fetch(URL)
      .then(res => res.json())
      .then(results => results.items && this.setState({ todayItems: results.items }))
      .catch((err) => {
        console.log('Request for aqi failed', err);
      });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <Swiper
            cards={this.state.todayItems}
            renderCard={card => (
              <View style={styles.card}>
                <View>
                  <Text style={styles.text}>{card.kanji}</Text>
                  <Text style={styles.text}>{card.kana}</Text>
                  <Text style={styles.thinText}>{card.romaji}</Text>
                  <Text style={styles.thinText}>{I18n.t(`minna.${card.romaji}`)}</Text>
                </View>

                <ReadableButton
                  title={I18n.t('app.assessment.read')}
                  text={cleanWord(card.kana)}
                  trackEvent={'user-action-press-today-read'}
                />
              </View>
            )}
            onSwiped={cardIndex => tracker.logEvent('user-action-swipe', { value: cardIndex })}
            onSwipedAll={() => tracker.logEvent('user-action-swipe-all')}
            cardIndex={0}
            cardVerticalMargin={Platform.OS === 'ios' ? 40 : 50}
            backgroundColor={iOSColors.customGray}
            stackSize={3}
            marginBottom={Platform.OS === 'ios' ? 140 : 20}
            infinite
          >
            <Button
              onPress={() => {
                this.setState({ todayItems: shuffle([...this.state.todayItems]) });
              }}
              title="Shuffle"
            />
          </Swiper>
        </View>

        <AdMob unitId={config.admob[`japanese-${Platform.OS}-main-banner`]} />
      </SafeAreaView>
    );
  }
}
