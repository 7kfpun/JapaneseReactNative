import React, { Component } from 'react';

import { iOSColors } from 'react-native-typography';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

import { facebookLogin, googleLogin } from '../../../utils/auth';
import I18n from '../../../utils/i18n';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  body: {
    height: 160,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icon: {
    padding: 15,
  },
});

export default class LoginModal extends Component<Props> {
  state = {
    isSigninInProgress: false,
  };

  facebookLogin = async () => {
    this.setState({ isSigninInProgress: true });
    await facebookLogin();
    this.setState({ isSigninInProgress: false });
  };

  googleLogin = async () => {
    this.setState({ isSigninInProgress: true });
    await googleLogin();
    this.setState({ isSigninInProgress: false });
  };

  render() {
    const { handleClose, isVisible } = this.props;
    const { isSigninInProgress } = this.state;

    return (
      <Modal
        style={styles.container}
        isVisible={isVisible}
        onSwipe={handleClose}
        onBackButtonPress={handleClose}
        onBackdropPress={handleClose}
        scrollOffsetMax={300}
        swipeDirection="down"
      >
        <View style={styles.body}>
          <Text>{I18n.t('app.about.account.login-or-signup')}</Text>
          <View style={styles.icons}>
            <TouchableOpacity
              onPress={() => !isSigninInProgress && this.facebookLogin()}
            >
              <Ionicons
                style={styles.icon}
                name="logo-facebook"
                size={40}
                color={!isSigninInProgress ? '#3b5998' : iOSColors.gray}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => !isSigninInProgress && this.googleLogin()}
            >
              <Ionicons
                style={styles.icon}
                name="logo-googleplus"
                size={44}
                color={!isSigninInProgress ? '#dd4b39' : iOSColors.gray}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
