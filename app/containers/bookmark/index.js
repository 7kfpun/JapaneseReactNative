import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AdMob from '../../components/admob';

import { range } from '../../utils/helpers';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 40,
    padding: 20,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  stars: {
    flex: 1,
    flexDirection: 'row',
  },
  text: {
    flex: 3,
  },
});

type Props = {};
export default class Bookmark extends Component<Props> {
  static navigationOptions = {
    headerTitle: I18n.t('app.bookmark.title'),
    headerStyle: {
      backgroundColor: '#F7F7F7',
      borderBottomWidth: 0,
    },
  };

  static propTypes = {
    navigation: PropTypes.shape({}).isRequired,
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <ScrollView>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              navigation.navigate('bookmark-list', { starCount: 3 });
              tracker.logEvent('user-bookmark-goto-list', { count: 3 });
            }}
          >
            <View style={styles.stars}>
              {range(1, 4).map(i => (
                <Ionicons
                  key={i}
                  style={styles.lock}
                  name="ios-star"
                  size={20}
                  color={iOSColors.yellow}
                />
              ))}
            </View>
            <Text style={styles.text}>
              {`3 ${I18n.t('app.bookmark.stars')}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              navigation.navigate('bookmark-list', { starCount: 2 });
              tracker.logEvent('user-bookmark-goto-list', { count: 2 });
            }}
          >
            <View style={styles.stars}>
              {range(1, 3).map(i => (
                <Ionicons
                  key={i}
                  style={styles.lock}
                  name="ios-star"
                  size={20}
                  color={iOSColors.yellow}
                />
              ))}
            </View>
            <Text style={styles.text}>
              {`2 ${I18n.t('app.bookmark.stars')}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              navigation.navigate('bookmark-list', { starCount: 1 });
              tracker.logEvent('user-bookmark-goto-list', { count: 1 });
            }}
          >
            <View style={styles.stars}>
              <Ionicons
                style={styles.lock}
                name="ios-star"
                size={20}
                color={iOSColors.yellow}
              />
            </View>
            <Text style={styles.text}>
              {`1 ${I18n.t('app.bookmark.star')}`}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <AdMob unitId={config.admob[`${Platform.OS}-bookmark-banner`]} />
      </View>
    );
  }
}
