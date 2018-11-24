import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FlatList, Platform, StyleSheet, View } from 'react-native';

import firebase from 'react-native-firebase';
import store from 'react-native-simple-store';

import AdMob from '../../components/admob';
import VocabItem from '../../components/vocab-item';

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
      title: I18n.t('app.common.lesson_no', { lesson_no: params.item }),
      headerBackTitle: null,
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
          !__DEV__ &&
          !isPremium &&
          advert.isLoaded() &&
          item > 2 &&
          Math.random() < 0.6
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
      <View style={styles.container}>
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
      </View>
    );
  }
}
