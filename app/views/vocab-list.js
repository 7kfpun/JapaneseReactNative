import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import { SafeAreaView } from 'react-navigation';

import AdMob from '../elements/admob';
import VocabItem from '../elements/vocab-item';

import { items as vocabs } from '../utils/items';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

import { config } from '../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type Props = {};
// LessonList
export default class VocabList extends Component<Props> {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          item: PropTypes.number.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerBackTitle: null,
      headerTitle: I18n.t('app.common.lesson_no', { lesson_no: params.item }),
      headerRight: (
        <Button
          onPress={() => {
            navigation.navigate('Assessment', { item: params.item });
            tracker.logEvent('user-action-goto-assessment', { lesson: `${params.item}` });
          }}
          title={I18n.t('app.vocab-list.learn')}
          color={iOSColors.white}
        />
      ),
    };
  };

  state = {
    vocabs: [],
  }

  componentDidMount() {
    const { item } = this.props.navigation.state.params;
    this.setState({ vocabs: vocabs[`lesson${item}`].text });
  }

  render() {
    tracker.view('vocab-list');
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <FlatList
            style={styles.list}
            data={this.state.vocabs}
            keyExtractor={(item, index) => `${index}-${item}`}
            renderItem={({ item, index }) => (
              <VocabItem
                index={index}
                navigation={this.props.navigation}
                item={item}
              />
            )}
          />
        </ScrollView>
        <AdMob unitId={config.admob[`japanese-${Platform.OS}-vocablist-banner`]} />
      </SafeAreaView>
    );
  }
}
