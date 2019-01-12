import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';
import firebase from 'react-native-firebase';

import Row from '../../../components/row';
import LoginModal from './login-modal';

import I18n from '../../../utils/i18n';

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
});

export default class LoginButton extends Component<Props> {
  state = {
    isVisible: false,
  };

  componentDidMount() {
    this.unsubscriber = firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
      console.log('currentUser', user);
    });
  }

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber = null;
    }
  }

  render() {
    const { isVisible, key, user } = this.state;

    return (
      <View style={styles.container}>
        <Row
          text={
            user
              ? `Hi, ${user.displayName}`
              : I18n.t('app.about.account.not-yet-login')
          }
          onPress={() => {
            if (!user) {
              this.setState({ isVisible: true, key: Math.random() });
              // } else {
              // firebase.auth().signOut();
            }
          }}
        />

        <LoginModal
          key={key}
          isVisible={isVisible}
          handleClose={() => this.setState({ isVisible: false })}
        />
      </View>
    );
  }
}
