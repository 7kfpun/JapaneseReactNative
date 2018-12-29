import React, { Component } from 'react';

import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';

import { iOSColors } from 'react-native-typography';
import Search from 'react-native-search-box';

import Fuse from 'fuse.js';

import AdMob from '../../components/admob';
import VocabItem from '../../components/vocab-item';

import { flatten } from '../../utils/helpers';
import { items } from '../../utils/items';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchBlock: {
    borderBottomColor: iOSColors.lightGray,
    borderBottomWidth: 1,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '300',
    color: iOSColors.gray,
    backgroundColor: 'transparent',
    lineHeight: 40,
  },
});

const vocabs = flatten(
  Object.keys(items).map(key =>
    items[key].data.map(i => ({
      lesson: key,
      translation: I18n.t(`minna.${key}.${i.romaji}`),
      ...i,
    }))
  )
);

type Props = {};
export default class SearchView extends Component<Props> {
  static navigationOptions = {
    title: I18n.t('app.search.title'),
  };

  state = {
    searchText: '',
    searchResult: [],
  };

  onChangeText = searchText => {
    const options = {
      shouldSort: true,
      threshold: 0.18,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['kanji', 'kana', 'romaji', 'translation'],
    };
    const fuse = new Fuse(vocabs, options);
    const searchResult = fuse.search(searchText);

    this.setState({ searchText, searchResult });
    tracker.logEvent('user-search-vocab', { text: searchText });
  };

  onFocus = () => {
    tracker.logEvent('user-search-on-focus');
  };

  onCancel = () => {
    this.setState({ searchText: '' });
    tracker.logEvent('user-search-on-cancel');
  };

  onDelete = () => {
    this.setState({ searchText: '' });
    tracker.logEvent('user-search-on-delete');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchBlock}>
          <Search
            backgroundColor={iOSColors.white}
            titleCancelColor={iOSColors.blue}
            onChangeText={this.onChangeText}
            onFocus={this.onFocus}
            onCancel={this.onCancel}
            onDelete={this.onDelete}
            cancelTitle={I18n.t('app.search.cancel')}
            placeholder={I18n.t('app.search.title')}
          />
        </View>

        <View style={{ flex: 1 }}>
          {!!this.state.searchText && (
            <FlatList
              style={styles.list}
              data={this.state.searchResult}
              keyExtractor={(item, index) => `${index}-${item}`}
              renderItem={({ item, index }) => (
                <VocabItem
                  index={index}
                  item={item}
                  lesson={item.lesson}
                  isShowLesson={true}
                />
              )}
            />
          )}

          {!this.state.searchText && (
            <View style={styles.empty}>
              <Text style={styles.text}>
                {I18n.t('app.search.description')}
              </Text>
            </View>
          )}
        </View>

        <AdMob unitId={config.admob[`japanese-${Platform.OS}-search-banner`]} />
      </View>
    );
  }
}
