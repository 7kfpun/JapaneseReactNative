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
import Ionicons from 'react-native-vector-icons/Ionicons';
import Tts from 'react-native-tts';

import { cleanWord } from '../../utils/helpers';
import { items as vocabs } from '../../utils/items';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import AdMob from '../../elements/admob';

import { config } from '../../config';

Tts.setDefaultRate(0.4);
Tts.setDefaultLanguage('ja');
Tts.setDucking(true);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerRight: {
    paddingRight: 10,
    color: 'white',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '300',
    color: iOSColors.black,
    backgroundColor: 'transparent',
    lineHeight: 50,
  },
});

type Props = {};
export default class ReadAll extends Component<Props> {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          lesson: PropTypes.number.isRequired,
        }).isRequired,
      }).isRequired,
      setParams: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired,
    }).isRequired,
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    const count = params && params.count;
    const total = params && params.total;
    return {
      headerTitle: I18n.t('app.common.lesson_no', { lesson_no: params.lesson }),
      headerRight: total && (
        <Text style={styles.headerRight}>{`${count + 1} / ${total}`}</Text>
      ),
      tabBarLabel: I18n.t('app.common.lesson_no', { lesson_no: params.lesson }),
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-list' : 'ios-list-outline'}
          size={20}
          color={tintColor}
        />
      ),
    };
  };

  state = {
    speakTimes: 0,
    count: 0,
    isReading: true,
    isPremium: false,
  };

  componentDidMount() {
    const {
      navigation: {
        state: {
          params: { lesson },
        },
        goBack,
        setParams,
      },
    } = this.props;

    const total = vocabs[lesson].data.length;

    this.setState({ total });
    setParams({ count: 0, total });

    this.read();

    this.ttsEventListener = () => {
      const {
        count: newCount,
        total: newTotal,
        speakTimes: newSpeakTimes,
      } = this.state;
      if (newCount + 1 < newTotal) {
        this.setState(
          {
            count: parseInt((newSpeakTimes + 1) / 2, 10),
            speakTimes: newSpeakTimes + 1,
          },
          () => this.setCount(newCount)
        );
      } else {
        setTimeout(() => goBack(), 3000);
      }
    };

    Tts.addEventListener('tts-finish', this.ttsEventListener);
  }

  componentWillUnmount() {
    Tts.stop();
    Tts.removeEventListener('tts-finish', this.listener);
  }

  setCount(count) {
    this.props.navigation.setParams({ count });
    this.setState({ count });
  }

  read() {
    const {
      navigation: {
        state: {
          params: { lesson },
        },
      },
    } = this.props;

    Tts.stop();

    vocabs[lesson].data.forEach(i => {
      Tts.setDefaultLanguage('ja');
      Tts.speak(cleanWord(i.kana));

      if (I18n.voiceLocale) {
        Tts.setDefaultLanguage(I18n.voiceLocale);
        Tts.speak(I18n.t(`minna.${lesson}.${i.romaji}`));
      } else {
        Tts.speak(' ,,,,, '); // pause between word
      }
    });
  }

  render() {
    const { isPremium, isReading } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.body}
          onPress={() => {
            tracker.logEvent('user-action-read-all-press-button', {
              mode: isReading ? 'pause' : 'read',
            });

            if (isReading) {
              Tts.pause();
            } else {
              Tts.resume();
            }

            this.setState({ isReading: !isReading });
          }}
        >
          <View style={styles.body}>
            {!isPremium && (
              <AdMob
                unitId={config.admob[`japanese-${Platform.OS}-read-all-banner`]}
                bannerSize="MEDIUM_RECTANGLE"
              />
            )}

            <Ionicons
              style={{ paddingTop: 40 }}
              name={isReading ? 'ios-pause-outline' : 'ios-play-outline'}
              size={80}
              color={iOSColors.black}
            />
          </View>
        </TouchableOpacity>

        {!isPremium && (
          <AdMob
            unitId={config.admob[`japanese-${Platform.OS}-read-all-banner`]}
          />
        )}
      </SafeAreaView>
    );
  }
}
