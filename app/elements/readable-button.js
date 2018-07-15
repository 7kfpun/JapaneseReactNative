import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
} from 'react-native';

import Tts from 'react-native-tts';

import tracker from '../utils/tracker';

Tts.setDefaultRate(0.4);
Tts.setDefaultLanguage('ja');
Tts.setDucking(true);

export default class VocabItem extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    trackEvent: PropTypes.string.isRequired,
  }

  componentWillUnmount() {
    Tts.stop();
  }

  render() {
    return (
      <Button
        {...this.props}
        title={this.props.title}
        onPress={() => {
          console.log(this.props.text);
          Tts.speak(this.props.text);
          tracker.logEvent(this.props.trackEvent);
        }}
      />
    );
  }
}
