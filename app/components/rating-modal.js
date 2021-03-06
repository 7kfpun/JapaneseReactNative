import React, { Component } from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import * as Animatable from 'react-native-animatable';
import * as StoreReview from 'react-native-store-review';
import Icon from 'react-native-vector-icons/MaterialIcons';
import store from 'react-native-simple-store';

import { config } from '../config';

import { range } from '../utils/helpers';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const STARS_TO_APP_STORE = 4;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 10,
    borderColor: iOSColors.tealBlue,
    borderWidth: 3,
  },
  button: {
    marginTop: 6,
    padding: 10,
    backgroundColor: '#3B5998',
    borderRadius: 2,
  },
  ratingTitleText: {
    fontSize: 16,
    marginTop: 20,
  },
  ratingDescriptionText: {
    fontSize: 14,
    marginVertical: 15,
    textAlign: 'center',
  },
  feedbackDescriptionText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  close: {
    position: 'absolute',
    padding: 5,
    top: 6,
    right: 10,
  },
});

export default class RatingModal extends Component {
  state = {
    starCount: 0,
    isRatingClose: false,
  };

  componentDidMount() {
    const that = this;
    store.get('isRatingGiven').then(isRatingGiven => {
      if (isRatingGiven) {
        that.setState({ isRatingClose: true });
      }
    });
  }

  componentWillUnmount() {
    if (this.isRatingCloseTimeout) clearTimeout(this.isRatingCloseTimeout);
    if (this.openFeedbackUrlTimeout) clearTimeout(this.openFeedbackUrlTimeout);
  }

  onStarRatingPress(starCount) {
    this.setState({ starCount });

    let method = '';
    if (starCount >= STARS_TO_APP_STORE) {
      if (StoreReview.isAvailable) {
        StoreReview.requestReview();
        method = 'inapp-store-review';
      } else {
        Linking.openURL(config.store[Platform.OS]);
        method = Platform.OS;
      }

      const that = this;
      that.isRatingCloseTimeout = setTimeout(() => {
        this.setState({ isRatingClose: true });
      }, 2000);
    }

    tracker.logEvent('user-rating', {
      method,
      starCount: `${starCount}`,
    });
    store.save('isRatingGiven', true);
  }

  openFeedbackUrl = () => {
    Linking.openURL(I18n.t('app.rating.feedback-url'));
    const that = this;
    that.openFeedbackUrlTimeout = setTimeout(() => {
      this.setState({ isRatingClose: true });
    }, 2000);
  };

  render() {
    if (this.state.isRatingClose) {
      return null;
    }

    return (
      <Animatable.View style={styles.container} animation="fadeIn">
        <TouchableOpacity
          style={styles.close}
          onPress={() => this.setState({ isRatingClose: true })}
        >
          <Icon name="clear" size={24} color="#616161" />
        </TouchableOpacity>
        <Animatable.View animation="tada" iterationCount="infinite">
          <Icon name="thumb-up" size={32} color="#616161" />
        </Animatable.View>
        <Text style={styles.ratingTitleText}>{I18n.t('app.rating.title')}</Text>
        <Text style={styles.ratingDescriptionText}>
          {I18n.t('app.rating.title-description')}
        </Text>
        {this.state.starCount === 0 && (
          <View style={{ flexDirection: 'row' }}>
            {range(1, 6).map(i => (
              <Icon
                key={i}
                name={this.state.starCount >= i ? 'star' : 'star-border'}
                size={26}
                color="#616161"
                onPress={() => this.onStarRatingPress(i)}
              />
            ))}
          </View>
        )}
        {this.state.starCount > 0 && this.state.starCount < STARS_TO_APP_STORE && (
          <TouchableOpacity onPress={this.openFeedbackUrl}>
            <Animatable.View style={styles.button} animation="fadeIn">
              <Text style={styles.feedbackDescriptionText}>
                {I18n.t('app.rating.feedback-description')}
              </Text>
            </Animatable.View>
          </TouchableOpacity>
        )}
      </Animatable.View>
    );
  }
}
