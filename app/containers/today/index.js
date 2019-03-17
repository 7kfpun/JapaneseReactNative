import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Platform, StyleSheet, View } from 'react-native';

import { iOSColors } from 'react-native-typography';
import store from 'react-native-simple-store';
import Tts from 'react-native-tts';

import OutOfConnection from './components/out-of-connection';

import AdMob from '../../components/admob';
import AlertModal from '../../components/alert-modal';
import Card from '../../components/card';
import CardOptionSelector from '../../components/card-option-selector';
import CircleButton from '../../components/circle-button';
import CustomButton from '../../components/button';

import { checkPurchaseHistory, getPremiumInfo } from '../../utils/payment';
import { ttsSpeak, shuffle, openURL } from '../../utils/helpers';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

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
  footer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
});

type Props = {};
export default class Today extends Component<Props> {
  static navigationOptions = {
    title: I18n.t('app.today.title'),
    headerStyle: {
      backgroundColor: '#F7F7F7',
      borderBottomWidth: 0,
    },
  };

  static propTypes = {
    navigation: PropTypes.shape({}).isRequired,
  };

  state = {
    isKanaShown: false,
    isKanjiShown: false,
    isRomajiShown: false,
    isTranslationShown: false,
    isSoundOn: false,
    isAllShown: false,

    todayItems: [],
    outOfConnection: false,

    cardIndex: 0,
  };

  componentDidMount() {
    this.loadSettings();
    this.requestTodayItems();
    this.checkPurchaseHistory();
    this.checkAskPopup();
  }

  componentWillUnmount() {
    Tts.stop();
  }

  checkPurchaseHistory = async () => {
    const premiumInfo = await getPremiumInfo();
    if (
      // Check only if there is purchase before
      (premiumInfo.premiumUntil || premiumInfo.adFreeUntil) &&
      // Check only if it's expired
      (!premiumInfo.isPremium || !premiumInfo.isAdFree)
    ) {
      checkPurchaseHistory();
    }
  };

  checkAskPopup = async () => {
    const isAskPopupVisible = !(await store.get('isAskedHelpTranslation'));
    this.setState({ isAskPopupVisible });
  };

  loadSettings = async () => {
    const isNotFirstStart = await store.get('isNotFirstStart');
    if (!isNotFirstStart) {
      await store.save('isNotFirstStart', true);
      await store.save('isKanjiShown', true);
      await store.save('isKanaShown', true);
      await store.save('isRomajiShown', true);
      await store.save('isTranslationShown', true);
      await store.save('isSoundOn', true);
      await store.save('isOrdered', true);
    }

    const isKanjiShown = await store.get('isKanjiShown');
    const isKanaShown = await store.get('isKanaShown');
    const isRomajiShown = await store.get('isRomajiShown');
    const isTranslationShown = await store.get('isTranslationShown');
    const isSoundOn = await store.get('isSoundOn');

    this.setState({
      isKanjiShown,
      isKanaShown,
      isRomajiShown,
      isTranslationShown,
      isSoundOn,
    });
  };

  updateStates = (
    isKanjiShown,
    isKanaShown,
    isRomajiShown,
    isTranslationShown,
    isSoundOn
  ) => {
    console.log(
      'updateStates',
      isKanjiShown,
      isKanaShown,
      isRomajiShown,
      isTranslationShown,
      isSoundOn
    );
    this.setState({
      isKanjiShown,
      isKanaShown,
      isRomajiShown,
      isTranslationShown,
      isSoundOn,
    });
  };

  requestTodayItems() {
    const { isSoundOn } = this.state;

    const URL = `${config.server}/today`;
    console.log('Call', URL);
    fetch(URL)
      .then(res => res.json())
      .then(
        results => results.data && this.setState({ todayItems: results.data })
      )
      .then(() => {
        const { todayItems } = this.state;

        if (todayItems.length > 0) {
          this.setState({
            outOfConnection: false,
          });

          if (isSoundOn) {
            ttsSpeak(todayItems[0], { useKana: true });
            tracker.logEvent('app-today-read');
          }
        } else {
          this.setState({
            outOfConnection: true,
          });
        }
      })
      .catch(err => {
        console.log('Request for aqi failed', err);
        this.setState({
          outOfConnection: true,
        });
        tracker.logEvent('app-today-out-of-connection');
      });
  }

  render() {
    const { navigation } = this.props;

    const {
      isAskPopupVisible,
      todayItems,
      cardIndex,
      isKanjiShown,
      isKanaShown,
      isRomajiShown,
      isTranslationShown,
      isAllShown,
      isSoundOn,
      outOfConnection,
    } = this.state;

    const card = todayItems.length > 0 ? todayItems[cardIndex] : null;

    return (
      <View style={styles.container}>
        <CardOptionSelector
          isOrderedEnable={false}
          onUpdate={this.updateStates}
        />

        <View style={{ flex: 1, paddingHorizontal: 26, paddingBottom: 30 }}>
          {outOfConnection && (
            <OutOfConnection
              onPress={() => {
                this.requestTodayItems();
                tracker.logEvent('user-today-reconnect');
              }}
            />
          )}
          {!outOfConnection && card && (
            <Card
              navigation={navigation}
              lesson={card.lesson}
              kanji={card.kanji}
              kana={card.kana}
              romaji={card.romaji}
              translation={I18n.t(`minna.${card.lesson}.${card.romaji}`)}
              isKanjiShown={isKanjiShown}
              isKanaShown={isKanaShown}
              isRomajiShown={isRomajiShown}
              isTranslationShown={isTranslationShown}
              isAllShown={isAllShown}
            />
          )}
        </View>

        <View style={styles.footer}>
          <CustomButton
            raised
            onPress={() => {
              if (todayItems && todayItems.length > 0) {
                this.setState({ todayItems: shuffle([...todayItems]) }, () => {
                  if (isSoundOn) {
                    const { todayItems: newTodayItems } = this.state;
                    ttsSpeak(newTodayItems[cardIndex], { useKana: true }); // TODO: improve shuffle
                  }
                });
                tracker.logEvent('user-today-press-shuffle');
              }
            }}
            title={I18n.t('app.today.shuffle')}
            titleStyles={{ fontSize: 20 }}
          />

          <CircleButton
            containerStyles={{ marginHorizontal: 15 }}
            onPressIn={() => this.setState({ isAllShown: true })}
            onPressOut={() => this.setState({ isAllShown: false })}
            onPress={() => {
              if (todayItems && todayItems.length > 0) {
                ttsSpeak(todayItems[cardIndex], { useKana: true });
                tracker.logEvent('user-today-press-show-all');
              }
            }}
          />

          <CustomButton
            raised
            onPress={() => {
              if (todayItems && todayItems.length > 0) {
                const isLast = cardIndex === todayItems.length - 1;
                this.setState({ cardIndex: isLast ? 0 : cardIndex + 1 }, () => {
                  if (isSoundOn) {
                    ttsSpeak(todayItems[isLast ? 0 : cardIndex + 1], {
                      useKana: true,
                    });
                  }
                });
                tracker.logEvent('user-today-press-next');
              }
            }}
            title={I18n.t('app.common.next')}
            titleStyles={{ fontSize: 20 }}
          />
        </View>

        <AlertModal
          isVisible={isAskPopupVisible}
          title={I18n.t('app.feedback.help-translation')}
          description={I18n.t('app.feedback.help-translation-description')}
          handleCancel={() => {
            store.save('isAskedHelpTranslation', true);
            this.setState({ isAskPopupVisible: false });
            tracker.logEvent(`user-ask-goto-help-translation`, {
              value: 'false',
            });
          }}
          handleOK={() => {
            store.save('isAskedHelpTranslation', true);
            this.setState({ isAskPopupVisible: false });
            openURL('https://minna-app.oneskyapp.com/collaboration', false);
            tracker.logEvent(`user-ask-goto-help-translation`, {
              value: 'true',
            });
          }}
        />
        <AdMob unitId={config.admob[`${Platform.OS}-today-banner`]} />
      </View>
    );
  }
}
