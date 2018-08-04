import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
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

import AdMob from '../../elements/admob';
import VocabItem from '../../elements/vocab-item';

// import { checkAdRemoval } from '../../utils/products';

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

    return {
      headerBackTitle: null,
      headerTitle: I18n.t('app.common.lesson_no', { lesson_no: params.item }),
      tabBarLabel: I18n.t('app.common.lesson_no', { lesson_no: params.item }),
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-list' : 'ios-list-outline'}
          size={20}
          color={tintColor}
        />
      ),
      headerRight: (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* <Animatable.View animation="tada" iterationCount={10}>
            <TouchableOpacity
              style={{ padding: 12 }}
              onPress={() => {
                navigation.navigate('read-all', { lesson: params.item });
                tracker.logEvent('user-action-read-all', { lesson: `${params.item}` });
              }}
            >
              <Ionicons name="ios-play" size={28} color="white" />
            </TouchableOpacity>
          </Animatable.View> */}

          <Animatable.View animation="tada" iterationCount={10}>
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
          </Animatable.View>
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
    }).isRequired,
  };

  state = {
    vocabs: [],
  };

  async componentDidMount() {
    this.getVocabs();

    // const isAdRemoval = await checkAdRemoval();
    // if (!isAdRemoval) {
    setTimeout(() => {
      if (advert.isLoaded() && Math.random() < 0.4) {
        advert.show();
        tracker.logEvent('app-action-vocab-list-popup');
      }
    }, 3000);
    // }
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

    const { vocabs } = this.state;

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

        <AdMob
          unitId={config.admob[`japanese-${Platform.OS}-vocab-list-banner`]}
        />
      </SafeAreaView>
    );
  }
}
