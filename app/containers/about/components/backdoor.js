import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';
import OneSignal from 'react-native-onesignal';
import RNRestart from 'react-native-restart';
import store from 'react-native-simple-store';

import I18n from '../../../utils/i18n';
import tracker from '../../../utils/tracker';

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  row: {
    paddingHorizontal: 10,
    paddingVertical: 10,
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
  subtext: {
    fontSize: 16,
    fontWeight: '300',
    color: 'black',
  },
});

export default class Backdoor extends Component {
  static sendTags(value) {
    const tags = {
      isBackdoor: true,
      code: value,
    };

    console.log('Send tags', tags);
    OneSignal.sendTags(tags);

    tracker.logEvent('set-premium-backdoor', { code: value });
  }

  state = {
    clicks: 0,
    isInputShown: false,
    invitationCodes: [],
    text: '',
  };

  onPress = () => {
    this.setState(
      {
        clicks: this.state.clicks + 1,
      },
      () => {
        if (this.state.clicks === 7) {
          this.getConfig();
          this.setState({
            isInputShown: true,
          });
        }
      }
    );
  };

  getConfig() {
    firebase
      .config()
      .fetch(60) // cache for 60 seconds
      .then(() => firebase.config().activateFetched())
      .then(() => firebase.config().getKeysByPrefix(`invitation_code_`))
      .then(arr => firebase.config().getValues(arr))
      .then(objects => {
        const data = [];
        // Retrieve values
        Object.keys(objects).forEach(key => {
          data.push(objects[key].val());
        });

        console.log('firebase config values', data);
        this.setState({ invitationCodes: data });
      })
      .catch(console.error);
  }

  render() {
    const { isInputShown } = this.state;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.onPress}>
          <View style={styles.row}>
            <Text style={styles.text}>{`${I18n.t('app.about.version')}:`}</Text>
            <Text style={styles.subtext}>
              {DeviceInfo.getReadableVersion()}
            </Text>
          </View>
        </TouchableOpacity>

        {isInputShown && (
          <View
            style={[
              styles.row,
              {
                flexDirection: 'column',
                alignItems: 'stretch',
                borderTopWidth: 0,
              },
            ]}
          >
            <Text style={styles.subtext}>
              {'Please input your invitation code:'}
            </Text>
            <TextInput
              style={{
                height: 26,
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
              }}
              onChangeText={text => {
                this.setState({ text });
                this.state.invitationCodes.forEach(invitationCode => {
                  if (text.toLowerCase() === invitationCode.toLowerCase()) {
                    Backdoor.sendTags(invitationCode);
                    store.save('isPremium', true);

                    Alert.alert(
                      I18n.t('app.about.purchase.title'),
                      null,
                      [{ text: 'OK', onPress: () => RNRestart.Restart() }],
                      { cancelable: false }
                    );
                  }
                });
              }}
              value={this.state.text}
            />
          </View>
        )}
      </View>
    );
  }
}
