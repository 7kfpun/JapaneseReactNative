import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  TouchableOpacity,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

import { SafeAreaView } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import firebase from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AdMob from '../elements/admob';
import VocabItem from '../elements/vocab-item';

// import { checkAdRemoval } from '../utils/products';

import { items as vocabs } from '../utils/items';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

import { config } from '../config';

const advert = firebase.admob().interstitial(config.admob[`japanese-${Platform.OS}-popup`]);

const { AdRequest } = firebase.admob;
const request = new AdRequest();
request.addKeyword('study').addKeyword('japanese').addKeyword('travel');

advert.loadAd(request.build());

advert.on('onAdLoaded', () => {
  console.log('Advert ready to show.');
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navText: {
    paddingHorizontal: 8,
    color: 'white',
    fontSize: 18,
  },
});

type Props = {};
export default class VocabList extends Component<Props> {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          item: PropTypes.number.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerBackTitle: null,
      headerTitle: I18n.t('app.common.lesson_no', { lesson_no: params.item }),
      tabBarLabel: I18n.t('app.common.lesson_no', { lesson_no: params.item }),
      tabBarIcon: ({ tintColor, focused }) => <Ionicons name={focused ? 'ios-list' : 'ios-list-outline'} size={20} color={tintColor} />,
      headerRight: (
        <Animatable.View animation="tada" iterationCount={10} >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('assessment', { item: params.item });
              tracker.logEvent('user-action-goto-assessment', { lesson: `${params.item}` });
            }}
          >
            <Text style={styles.navText}>{I18n.t('app.vocab-list.learn')}</Text>
          </TouchableOpacity>

        </Animatable.View>
      ),
    };
  };

  state = {
    vocabs: [],
  }

  async componentDidMount() {
    const { item } = this.props.navigation.state.params;
    this.setState({ vocabs: vocabs[item].data, lessonNo: item });

    // const isAdRemoval = await checkAdRemoval();
    // if (!isAdRemoval) {
    setTimeout(() => {
      if (advert.isLoaded() && Math.random() < 0.4) {
        advert.show();
      }
    }, 3000);
    // }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <FlatList
            style={styles.list}
            data={this.state.vocabs}
            keyExtractor={(item, index) => `${index}-${item}`}
            renderItem={({ item, index }) => (
              <VocabItem
                index={index}
                item={item}
              />
            )}
          />
        </ScrollView>
        <AdMob unitId={config.admob[`japanese-${Platform.OS}-vocablist-banner`]} />
      </SafeAreaView>
    );
  }
}
