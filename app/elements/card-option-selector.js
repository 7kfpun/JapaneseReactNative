import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import store from 'react-native-simple-store';

import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
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
  }

  static defaultProps = {
    onUpdate: () => {},
    isKanjiShownEnable: true,
    isKanaShownEnable: true,
    isRomajiShownEnable: true,
    isTranslationShownEnable: true,
    isSoundOnEnable: true,
    isOrderedEnable: true,
  }

  state = {
    isKanjiShown: true,
    isKanaShown: true,
    isRomajiShown: true,
    isTranslationShown: true,
    isSoundOn: true,
    isOrdered: true,
  }

  componentDidMount() {
    store
      .get('notFirstStart').then((notFirstStart) => {
        if (notFirstStart) {
          store.get('isKanjiShown').then(isKanjiShown => this.setState({ isKanjiShown }));
          store.get('isKanaShown').then(isKanaShown => this.setState({ isKanaShown }));
          store.get('isRomajiShown').then(isRomajiShown => this.setState({ isRomajiShown }));
          store.get('isTranslationShown').then(isTranslationShown => this.setState({ isTranslationShown }));
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
    this.setState({
      [name]: !this.state[name],
    }, () => {
      store.save(name, this.state[name]);

      console.log('toggleSelection', name, this.state[name]);
      this.props.onUpdate(
        this.state.isKanjiShown,
        this.state.isKanaShown,
        this.state.isRomajiShown,
        this.state.isTranslationShown,
        this.state.isSoundOn,
        this.state.isOrdered,
      );

      tracker.logEvent(`user-action-set-${name}`, { value: this.state[name] });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.isKanaShownEnable && <TouchableOpacity
          style={styles.icon}
          onPress={() => this.toggleSelection('isKanaShown')}
        >
          <Text style={[styles.text, { color: this.state.isKanaShown ? iOSColors.tealBlue : iOSColors.midGray }]}>{I18n.t('app.assessment.kana')}</Text>
        </TouchableOpacity>}
        {this.props.isKanjiShownEnable && <TouchableOpacity
          style={styles.icon}
          onPress={() => this.toggleSelection('isKanjiShown')}
        >
          <Text style={[styles.text, { color: this.state.isKanjiShown ? iOSColors.tealBlue : iOSColors.midGray }]}>{I18n.t('app.assessment.kanji')}</Text>
        </TouchableOpacity>}
        {this.props.isRomajiShownEnable && <TouchableOpacity
          style={styles.icon}
          onPress={() => this.toggleSelection('isRomajiShown')}
        >
          <Text style={[styles.text, { color: this.state.isRomajiShown ? iOSColors.tealBlue : iOSColors.midGray }]}>{I18n.t('app.assessment.romaji')}</Text>
        </TouchableOpacity>}
        {this.props.isTranslationShownEnable && <TouchableOpacity
          style={styles.icon}
          onPress={() => this.toggleSelection('isTranslationShown')}
        >
          <Text style={[styles.text, { color: this.state.isTranslationShown ? iOSColors.tealBlue : iOSColors.midGray }]}>{I18n.t('app.assessment.translation')}</Text>
        </TouchableOpacity>}
        {this.props.isSoundOnEnable && <TouchableOpacity
          style={styles.icon}
          onPress={() => this.toggleSelection('isSoundOn')}
        >
          <Ionicons name={this.state.isSoundOn ? 'ios-volume-up' : 'ios-volume-off'} size={28} color={this.state.isSoundOn ? iOSColors.tealBlue : iOSColors.midGray} />
        </TouchableOpacity>}
        {this.props.isOrderedEnable && <TouchableOpacity
          style={styles.icon}
          onPress={() => this.toggleSelection('isOrdered')}
        >
          <Ionicons name={this.state.isOrdered ? 'ios-shuffle' : 'ios-list'} size={28} color="black" />
        </TouchableOpacity>}
      </View>
    );
  }
}
