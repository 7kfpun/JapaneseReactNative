import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import store from 'react-native-simple-store';

import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    ...Platform.select({
      ios: {
        padding: 8,
      },
      android: {
        paddingHorizontal: 8,
        paddingVertical: 2,
      },
    }),
  },
  icon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default class CardOptionSelector extends Component {
  static propTypes = {
    onUpdate: PropTypes.func,
    isKanjiShownEnable: PropTypes.bool,
    isKanaShownEnable: PropTypes.bool,
    isRomajiShownEnable: PropTypes.bool,
    isTranslationShownEnable: PropTypes.bool,
    isSoundOnEnable: PropTypes.bool,
    isOrderedEnable: PropTypes.bool,
  };

  static defaultProps = {
    onUpdate: () => {},
    isKanjiShownEnable: true,
    isKanaShownEnable: true,
    isRomajiShownEnable: true,
    isTranslationShownEnable: true,
    isSoundOnEnable: true,
    isOrderedEnable: true,
  };

  state = {
    isKanjiShown: true,
    isKanaShown: true,
    isRomajiShown: true,
    isTranslationShown: true,
    isSoundOn: true,
    isOrdered: true,
  };

  componentDidMount() {
    store.get('notFirstStart').then(notFirstStart => {
      if (notFirstStart) {
        store
          .get('isKanjiShown')
          .then(isKanjiShown => this.setState({ isKanjiShown }));
        store
          .get('isKanaShown')
          .then(isKanaShown => this.setState({ isKanaShown }));
        store
          .get('isRomajiShown')
          .then(isRomajiShown => this.setState({ isRomajiShown }));
        store
          .get('isTranslationShown')
          .then(isTranslationShown => this.setState({ isTranslationShown }));
        store.get('isSoundOn').then(isSoundOn => this.setState({ isSoundOn }));
        store.get('isOrdered').then(isOrdered => this.setState({ isOrdered }));
      } else {
        store.save('isKanjiShown', true);
        store.save('isKanaShown', true);
        store.save('isRomajiShown', true);
        store.save('isTranslationShown', true);
        store.save('isSoundOn', true);
        store.save('isOrdered', true);
        store.save('notFirstStart', true);

        this.setState({ isKanjiShown: true });
        this.setState({ isKanaShown: true });
        this.setState({ isRomajiShown: true });
        this.setState({ isTranslationShown: true });
        this.setState({ isSoundOn: true });
        this.setState({ isOrdered: true });
      }
    });
  }

  toggleSelection(name) {
    const { [name]: nameState } = this.state;

    this.setState(
      {
        [name]: !nameState,
      },
      () => {
        const { [name]: newNameState } = this.state;
        store.save(name, newNameState);

        console.log('toggleSelection', name, newNameState);

        const {
          isKanaShown,
          isKanjiShown,
          isRomajiShown,
          isTranslationShown,
          isSoundOn,
          isOrdered,
        } = this.state;

        const { onUpdate } = this.props;
        onUpdate(
          isKanjiShown,
          isKanaShown,
          isRomajiShown,
          isTranslationShown,
          isSoundOn,
          isOrdered
        );

        tracker.logEvent(`user-action-set-${name}`, { value: newNameState });
      }
    );
  }

  render() {
    const {
      isKanaShownEnable,
      isKanjiShownEnable,
      isRomajiShownEnable,
      isTranslationShownEnable,
      isSoundOnEnable,
      isOrderedEnable,
    } = this.props;

    const {
      isKanaShown,
      isKanjiShown,
      isRomajiShown,
      isTranslationShown,
      isSoundOn,
      isOrdered,
    } = this.state;

    return (
      <View style={styles.container}>
        {isKanaShownEnable && (
          <TouchableOpacity
            style={styles.icon}
            onPress={() => this.toggleSelection('isKanaShown')}
          >
            <Text
              style={[
                styles.text,
                { color: isKanaShown ? iOSColors.tealBlue : iOSColors.midGray },
              ]}
            >
              {I18n.t('app.common.kana')}
            </Text>
          </TouchableOpacity>
        )}

        {isKanjiShownEnable && (
          <TouchableOpacity
            style={styles.icon}
            onPress={() => this.toggleSelection('isKanjiShown')}
          >
            <Text
              style={[
                styles.text,
                {
                  color: isKanjiShown ? iOSColors.tealBlue : iOSColors.midGray,
                },
              ]}
            >
              {I18n.t('app.common.kanji')}
            </Text>
          </TouchableOpacity>
        )}

        {isRomajiShownEnable && (
          <TouchableOpacity
            style={styles.icon}
            onPress={() => this.toggleSelection('isRomajiShown')}
          >
            <Text
              style={[
                styles.text,
                {
                  color: isRomajiShown ? iOSColors.tealBlue : iOSColors.midGray,
                },
              ]}
            >
              {I18n.t('app.common.romaji')}
            </Text>
          </TouchableOpacity>
        )}

        {isTranslationShownEnable && (
          <TouchableOpacity
            style={styles.icon}
            onPress={() => this.toggleSelection('isTranslationShown')}
          >
            <MaterialCommunityIcons
              name="translate"
              size={22}
              color={
                isTranslationShown ? iOSColors.tealBlue : iOSColors.midGray
              }
            />
          </TouchableOpacity>
        )}

        {isSoundOnEnable && (
          <TouchableOpacity
            style={styles.icon}
            onPress={() => this.toggleSelection('isSoundOn')}
          >
            <MaterialCommunityIcons
              name="ear-hearing"
              size={22}
              color={isSoundOn ? iOSColors.tealBlue : iOSColors.midGray}
            />
          </TouchableOpacity>
        )}

        {isOrderedEnable && (
          <TouchableOpacity
            style={styles.icon}
            onPress={() => this.toggleSelection('isOrdered')}
          >
            <Ionicons
              name={isOrdered ? 'ios-shuffle' : 'ios-list'}
              size={28}
              color={iOSColors.tealBlue}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
