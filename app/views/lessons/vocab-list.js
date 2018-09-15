import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import { SafeAreaView } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import firebase from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import store from 'react-native-simple-store';

import AdMob from '../../elements/admob';
import VocabItem from '../../elements/vocab-item';

import { items as vocabularies } from '../../utils/items';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

const advert = firebase
  .admob()
  .interstitial(config.admob[`japanese-${Platform.OS}-popup`]);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  navText: {
    paddingHorizontal: 8,
    color: 'white',
    fontSize: 18,
  },
});

type Props = {};
export default class VocabList extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    const isPremium = params && params.isPremium;

    return {
      headerBackTitle: null,
      headerTitle: I18n.t('app.common.lesson_no', { lesson_no: params.item }),
      tabBarLabel: 'みんなの日本語',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-list' : 'ios-list'}
          size={20}
          color={tintColor}
        />
      ),
      headerRight: (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {Platform.OS === 'ios' && (
            <Animatable.View animation="tada" iterationCount={10}>
              <TouchableOpacity
                style={{ padding: 12 }}
                onPress={() => {
                  if (isPremium || params.item <= 3) {
                    navigation.navigate('read-all', { lesson: params.item });
                    tracker.logEvent('user-action-goto-read-all', {
                      lesson: `${params.item}`,
                    });
                  } else {
                    tracker.logEvent('app-action-read-all-premium-required', {
                      lesson: `${params.item}`,
                    });

                    Alert.alert(
                      I18n.t('app.read-all.premium-required-title'),
                      I18n.t('app.read-all.premium-required-description'),
                      [
                        {
                          text: 'Cancel',
                          onPress: () => {
                            console.log('Cancel Pressed');
                            tracker.logEvent('user-action-read-all-premium', {
                              lesson: `${params.item}`,
                              interest: false,
                            });
                          },
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => {
                            setTimeout(() => {
                              navigation.navigate('about');
                            }, 1000);

                            tracker.logEvent('user-action-read-all-premium', {
                              lesson: `${params.item}`,
                              interest: true,
                            });
                          },
                        },
                      ],
                      { cancelable: false }
                    );
                  }
                }}
              >
                <Ionicons name="ios-play" size={28} color="white" />
              </TouchableOpacity>
            </Animatable.View>
          )}

          <TouchableOpacity
            style={{ padding: 12, paddingRight: 15 }}
            onPress={() => {
              navigation.navigate('assessment', { lesson: params.item });
              tracker.logEvent('user-action-goto-assessment', {
                lesson: `${params.item}`,
              });
            }}
          >
            <Ionicons name="md-list-box" size={22} color={iOSColors.white} />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          item: PropTypes.number.isRequired,
        }).isRequired,
      }).isRequired,
      setParams: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    vocabs: [],
    isPremium: false,
  };

  async componentDidMount() {
    const {
      navigation: {
        state: {
          params: { item },
        },
      },
    } = this.props;

    store.get('isPremium').then(isPremium => {
      this.setState({ isPremium });
      this.props.navigation.setParams({ isPremium });

      setTimeout(() => {
        if (
          !isPremium &&
          advert.isLoaded() &&
          item > 2 &&
          Math.random() < 0.5
        ) {
          advert.show();
          tracker.logEvent('app-action-vocab-list-popup');
        }
      }, 3000);
    });

    this.getVocabs();
  }

  getVocabs = () => {
    const {
      navigation: {
        state: {
          params: { item },
        },
      },
    } = this.props;

    this.setState({ vocabs: vocabularies[item].data });
  };

  render() {
    const {
      navigation: {
        state: {
          params: { item: lesson },
        },
      },
    } = this.props;

    const { isPremium, vocabs } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.list}
          data={vocabs}
          keyExtractor={(item, index) => `${index}-${item}`}
          renderItem={({ item, index }) => (
            <VocabItem index={index} item={item} lesson={lesson} />
          )}
        />

        {!isPremium && (
          <AdMob
            unitId={config.admob[`japanese-${Platform.OS}-vocab-list-banner`]}
          />
        )}
      </SafeAreaView>
    );
  }
}
