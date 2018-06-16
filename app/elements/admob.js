import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';

import { checkAdRemoval } from '../utils/products';

const { AdRequest, Banner } = firebase.admob;
const request = new AdRequest();

export default class Admob extends Component {
  static propTypes = {
    bannerSize: PropTypes.string,
    unitId: PropTypes.string,
    margin: PropTypes.number,
    backgroundColor: PropTypes.string,
    alignItems: PropTypes.string,
  }

  static defaultProps = {
    margin: 0,
    unitId: null,
    bannerSize: 'SMART_BANNER',
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
  }

  state = {
    isReceived: false,
    isReceivedFailed: false,
    isAdRemoval: false,
    isAdDelaying: true,
  };

  componentDidMount() {
    this.checkAdRemoval();

    setTimeout(() => {
      this.setState({
        isAdDelaying: false,
      });
    }, 1500);

    setInterval(() => {
      this.checkAdRemoval();
    }, 60000);
  }

  async checkAdRemoval() {
    const isAdRemoval = await checkAdRemoval();
    this.setState({ isAdRemoval });
  }

  render() {
    if (this.state.isReceivedFailed || this.state.isAdRemoval || this.state.isAdDelaying) {
      return null;
    }

    const height = DeviceInfo.isTablet() ? 90 : 50;

    return (
      <View
        style={{
          height: this.state.isReceived ? height : 0,
          margin: this.props.margin,
          backgroundColor: this.props.backgroundColor,
          alignItems: this.props.alignItems,
          justifyContent: 'flex-end',
        }}
      >
        <Banner
          size={this.props.bannerSize}
          unitId={this.props.unitId}
          request={request.build()}
          onAdLoaded={() => {
            console.log('Ads received');
            this.setState({ isReceived: true });
          }}
          onAdFailedToLoad={(error) => {
            console.log('Ads error', error);
            this.setState({ isReceivedFailed: true });
          }}
        />
      </View>
    );
  }
}
