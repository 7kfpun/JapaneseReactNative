import React, { Component } from 'react';
import { func, string } from 'prop-types';

import { iOSColors } from 'react-native-typography';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

import { noop } from '../utils/helpers';
import I18n from '../utils/i18n';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  body: {
    height: height - 400,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  title: {
    alignItems: 'center',
    paddingTop: 25,
  },
  titleText: {
    fontWeight: '400',
    fontSize: 18,
    color: 'black',
  },
  description: {
    alignItems: 'center',
  },
  descriptionText: {
    fontWeight: '300',
    fontSize: 16,
    color: 'black',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: '300',
    fontSize: 16,
    color: iOSColors.gray,
  },
  okText: {
    fontWeight: '600',
    fontSize: 16,
    color: iOSColors.tealBlue,
  },
  footer: {
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icon: {
    padding: 15,
  },
});

export default class AlertModal extends Component<Props> {
  state = {
    isClose: false,
  };

  render() {
    const {
      handleClose,
      handleCancel,
      handleOK,
      isVisible,
      title,
      description,
      okText,
      cancelText,
    } = this.props;
    const { isClose } = this.state;

    return (
      <Modal
        style={styles.container}
        isVisible={isVisible && !isClose}
        onSwipe={handleClose}
        onBackButtonPress={handleClose}
        onBackdropPress={handleClose}
        scrollOffsetMax={300}
      >
        <View style={styles.body}>
          <View style={styles.title}>
            <Text style={styles.titleText}>{title}</Text>
          </View>

          <View style={styles.description}>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={handleCancel}>
              <View style={styles.button}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }} onPress={handleOK}>
              <View style={styles.button}>
                <Text style={styles.okText}>{okText}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

AlertModal.propTypes = {
  handleClose: func,
  handleCancel: func,
  handleOK: func,
  isVisible: string,
  title: string,
  description: string,
  okText: string,
  cancelText: string,
};
AlertModal.defaultProps = {
  handleClose: noop,
  handleCancel: noop,
  handleOK: noop,
  isVisible: null,
  title: null,
  description: null,
  okText: 'OK',
  cancelText: 'Cancel',
};
