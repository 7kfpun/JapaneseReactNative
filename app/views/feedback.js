import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ActivityIndicator, StyleSheet, View, WebView } from 'react-native';

import { iOSColors } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

import I18n from '../utils/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iOSColors.white,
  },
  loading: {
    margin: 20,
  },
});

type Props = {};
export default class Feedback extends Component<Props> {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          lesson: PropTypes.number,
          item: PropTypes.shape({
            kana: PropTypes.string.isRequired,
            kanji: PropTypes.string.isRequired,
            romaji: PropTypes.string.isRequired,
          }),
        }),
      }).isRequired,
      setParams: PropTypes.func.isRequired,
    }).isRequired,
  };

  static navigationOptions = {
    title: I18n.t('app.feedback.title'),
    tabBarLabel: I18n.t('app.feedback.title'),
    tabBarIcon: ({ tintColor, focused }) => (
      <Ionicons
        name={focused ? 'ios-chatboxes' : 'ios-chatboxes'}
        size={20}
        color={tintColor}
      />
    ),
  };

  state = {
    isLoading: true,
  };

  render() {
    let uri;
    const {
      navigation: {
        state: { params },
      },
    } = this.props;

    if (params) {
      const {
        lesson,
        item: { kana, kanji, romaji },
      } = params;

      uri = I18n.t('app.feedback.issueUrl')
        .replace('{lesson}', lesson)
        .replace('{kana}', kana)
        .replace('{kanji}', kanji)
        .replace('{romaji}', romaji)
        .replace('{translation}', I18n.t(`minna.${lesson}.${romaji}`));
    } else {
      uri = I18n.t('app.feedback.url');
    }

    return (
      <View style={styles.container}>
        {this.state.isLoading && (
          <ActivityIndicator style={styles.loading} size="small" />
        )}
        <WebView
          source={{ uri }}
          onLoadEnd={() => this.setState({ isLoading: false })}
        />
      </View>
    );
  }
}
