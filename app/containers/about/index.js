import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Linking, Platform, StyleSheet, ScrollView, View } from 'react-native';

import DeviceInfo from 'react-native-device-info';
import OneSignal from 'react-native-onesignal';
import store from 'react-native-simple-store';

import Backdoor from './components/backdoor';
import NotificationSetting from './components/notification-setting';
import AdMob from '../../components/admob';
import Row from '../../components/row';

import { openURL, prepareURL } from '../../utils/helpers';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
});

type Props = {};
export default class About extends Component<Props> {
  static navigationOptions = {
    headerTitle: I18n.t('app.about.title'),
  };

  static propTypes = {
    navigation: PropTypes.shape({}).isRequired,
  };

  state = {
    isAdfree: false,
    isPremium: false,
  };

  componentDidMount() {
    OneSignal.init(config.onesignal, { kOSSettingsKeyAutoPrompt: true });
    store.get('isAdfree').then(isAdfree => this.setState({ isAdfree }));
    store.get('isPremium').then(isPremium => this.setState({ isPremium }));
  }

  render() {
    const { navigation } = this.props;
    const { isAdfree, isPremium } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={{ alignSelf: 'stretch' }}>
          <Backdoor />

          <NotificationSetting />

          {!isPremium && (
            <View style={{ marginTop: 10 }}>
              <Row
                text={I18n.t('app.about.premium.title')}
                onPress={() => {
                  navigation.navigate('premium');
                }}
              />

              {/* {!isAdfree && <Row
                first={false}
                text={I18n.t('app.about.adfree.title')}
                onPress={() => {
                  navigation.navigate('adfree');
                }}
              />} */}

              <Row
                first={false}
                text={I18n.t('app.about.restore')}
                onPress={() => {
                  this.getAvailablePurchases();
                }}
              />
            </View>
          )}

          <View style={{ marginVertical: 15 }}>
            <Row
              text={I18n.t('app.feedback.feedback')}
              onPress={() => {
                navigation.navigate('feedback');
                tracker.logEvent('feedback');
              }}
            />
            {Platform.OS === 'android' && (
              <Row
                first={false}
                text={I18n.t('app.feedback.tts-instruction')}
                description={I18n.t('app.feedback.tts-instruction-description')}
                onPress={() => {
                  const uri = prepareURL(
                    I18n.t('app.feedback.tts-instruction-url'),
                    {
                      manufacturer: DeviceInfo.getManufacturer(),
                      model: DeviceInfo.getModel(),
                      name: DeviceInfo.getDeviceId(),
                      type: DeviceInfo.getDeviceName(),
                      version: DeviceInfo.getSystemVersion(),
                      brand: DeviceInfo.getBrand(),
                    }
                  );

                  openURL(uri);
                  tracker.logEvent('tts-instruction');
                }}
              />
            )}
            <Row
              first={false}
              text={I18n.t('app.feedback.help-translation')}
              description={I18n.t('app.feedback.help-translation-description')}
              onPress={() => {
                Linking.openURL(
                  'https://minna-app.oneskyapp.com/collaboration'
                );
                tracker.logEvent('help-translation');
              }}
            />
          </View>
        </ScrollView>

        <AdMob unitId={config.admob[`japanese-${Platform.OS}-about-banner`]} />
      </View>
    );
  }
}
