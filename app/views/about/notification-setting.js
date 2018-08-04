import React, { Component } from 'react';
import { Platform, StyleSheet, Switch, Text, View } from 'react-native';

import { iOSColors } from 'react-native-typography';
import OneSignal from 'react-native-onesignal';

import { OneSignalGetTags } from '../../utils/onesignal';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    backgroundColor: 'white',
    borderTopColor: iOSColors.midGray,
    borderTopWidth: 0.5,
    borderBottomColor: iOSColors.midGray,
    borderBottomWidth: 0.5,
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
});

export default class NotificationSetting extends Component {
  static sendTags(value) {
    const tags = {
      isEnabled: value,
    };

    console.log('Send tags', tags);
    OneSignal.sendTags(tags);

    tracker.logEvent('set-notification', { label: value ? 'on' : 'off' });
  }

  state = {
    isEnabled: false,
  };

  componentDidMount() {
    this.loadSetting();
  }

  setNotification = value => {
    this.setState({ isEnabled: value }, () => {
      NotificationSetting.sendTags(value);

      if (value && Platform.OS === 'ios') {
        permissions = {
          alert: true,
          badge: true,
          sound: true,
        };
        OneSignal.requestPermissions(permissions);
        OneSignal.registerForPushNotifications();
      }
    });
  };

  async loadSetting() {
    const tags = await OneSignalGetTags();
    this.setState({ isEnabled: tags && tags.isEnabled === 'true' });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {I18n.t('app.about.notification_label')}
        </Text>
        <Switch
          onValueChange={this.setNotification}
          value={this.state.isEnabled}
          tintColor="#E0E0E0"
        />
      </View>
    );
  }
}
