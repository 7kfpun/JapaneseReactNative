import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';
import store from 'react-native-simple-store';

import { getTimestamp } from '../utils/helpers';

const { AdRequest, Banner } = firebase.admob;
const request = new AdRequest();
request
  .addKeyword('japanese')
  .addKeyword('study japanese')
  .addKeyword('japanese school')
  .addKeyword('日語')
  .addKeyword('日語遊學')
  .addKeyword('日語學校');

export default class Admob extends Component {
  static propTypes = {
    bannerSize: PropTypes.string,
    unitId: PropTypes.string,
    margin: PropTypes.number,
    backgroundColor: PropTypes.string,
    alignItems: PropTypes.string,
  };

  static defaultProps = {
    margin: 0,
    unitId: null,
    bannerSize: 'BANNER',
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
  };

  state = {
    isReceived: false,
    isReceivedFailed: false,
    isAdDelaying: true,
  };

  componentDidMount() {
    store
      .get('adFreeUntil')
      .then(adFreeUntil =>
        this.setState({ isAdfree: adFreeUntil > getTimestamp() })
      );

    setTimeout(() => {
      this.setState({
        isAdDelaying: false,
      });
    }, 1500);
  }

  render() {
    if (
      this.state.isAdfree ||
      this.state.isReceivedFailed ||
      this.state.isAdDelaying
    ) {
      return null;
    }

    let { bannerSize } = this.props;
    let height = 50;
    if (bannerSize === 'LARGE_BANNER') {
      height = 100;
    } else if (bannerSize === 'MEDIUM_RECTANGLE') {
      height = 250;
    } else if (DeviceInfo.isTablet()) {
      height = 90;
      bannerSize = 'SMART_BANNER';
    }

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
          size={bannerSize}
          unitId={this.props.unitId}
          request={request.build()}
          onAdLoaded={() => {
            console.log('Ads received');
            this.setState({ isReceived: true });
          }}
          onAdFailedToLoad={error => {
            console.log('Ads error', error);
            this.setState({ isReceivedFailed: true });
          }}
        />
      </View>
    );
  }
}
