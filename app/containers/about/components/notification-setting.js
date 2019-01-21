import React, { Component } from 'react';
import { Platform } from 'react-native';

import OneSignal from 'react-native-onesignal';

import RowSwitch from '../../../components/row-switch';

import { OneSignalGetTags } from '../../../utils/onesignal';
import I18n from '../../../utils/i18n';
import tracker from '../../../utils/tracker';

export default class NotificationSetting extends Component {
  static sendTags(value) {
    const tags = {
      isEnabled: value,
    };

    console.log('Send tags', tags);
    OneSignal.sendTags(tags);

    tracker.logEvent('user-set-notification', {
      label: value ? 'on' : 'off',
    });
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
      <RowSwitch
        text={I18n.t('app.about.notification.title')}
        description={I18n.t('app.about.notification.description')}
        onValueChange={this.setNotification}
        value={this.state.isEnabled}
      />
    );
  }
}
