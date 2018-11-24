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
import tracker from '../utils/tracker';

import I18n from '../utils/i18n';

const STARS_TO_APP_STORE = 4;
// const SHOW_RATING_AFTER = 30 * 60 * 1000;

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

export default class Rating extends Component {
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
      } else if (Platform.OS === 'ios') {
        Linking.openURL('itms-apps://itunes.apple.com/app/id1352780398');
        method = 'apple-store';
      } else if (Platform.OS === 'android') {
        Linking.openURL('market://details?id=com.kfpun.japanese');
        method = 'google-play';
      }

      const that = this;
      that.isRatingCloseTimeout = setTimeout(() => {
        this.setState({ isRatingClose: true });
      }, 2000);
    }

    tracker.logEvent('user-action-rating', {
      method,
      starCount: `${starCount}`,
    });
    store.save('isRatingGiven', true);
  }

  openFeedbackUrl = () => {
    Linking.openURL(I18n.t('app.rating.feedback_url'));
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
          {I18n.t('app.rating.title_description')}
        </Text>
        {this.state.starCount === 0 && (
          <View style={{ flexDirection: 'row' }}>
            <Icon
              name={this.state.starCount >= 1 ? 'star' : 'star-border'}
              size={26}
              color="#616161"
              onPress={() => this.onStarRatingPress(1)}
            />
            <Icon
              name={this.state.starCount >= 2 ? 'star' : 'star-border'}
              size={26}
              color="#616161"
              onPress={() => this.onStarRatingPress(2)}
            />
            <Icon
              name={this.state.starCount >= 3 ? 'star' : 'star-border'}
              size={26}
              color="#616161"
              onPress={() => this.onStarRatingPress(3)}
            />
            <Icon
              name={this.state.starCount >= 4 ? 'star' : 'star-border'}
              size={26}
              color="#616161"
              onPress={() => this.onStarRatingPress(4)}
            />
            <Icon
              name={this.state.starCount >= 5 ? 'star' : 'star-border'}
              size={26}
              color="#616161"
              onPress={() => this.onStarRatingPress(5)}
            />
          </View>
        )}
        {this.state.starCount > 0 &&
          this.state.starCount < STARS_TO_APP_STORE && (
            <TouchableOpacity onPress={this.openFeedbackUrl}>
              <Animatable.View style={styles.button} animation="fadeIn">
                <Text style={styles.feedbackDescriptionText}>
                  {I18n.t('app.rating.feedback_description')}
                </Text>
              </Animatable.View>
            </TouchableOpacity>
          )}
      </Animatable.View>
    );
  }
}
