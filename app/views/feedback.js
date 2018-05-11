import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  WebView,
} from 'react-native';

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
  static navigationOptions = {
    title: I18n.t('app.feedback.title'),
    tabBarLabel: I18n.t('app.feedback.title'),
    tabBarIcon: ({ tintColor, focused }) => <Ionicons name={focused ? 'ios-chatboxes' : 'ios-chatboxes-outline'} size={20} color={tintColor} />,
  };

  state = {
    isLoading: true,
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading && <ActivityIndicator style={styles.loading} size="small" />}
        <WebView
          source={{ uri: I18n.t('app.feedback.url') }}
          onLoadEnd={() => this.setState({ isLoading: false })}
        />
      </View>
    );
  }
}
