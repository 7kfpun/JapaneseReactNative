import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FlatList, Platform, StyleSheet, View } from 'react-native';

import { IndicatorViewPager, PagerTabIndicator } from 'rn-viewpager';
import { iOSColors } from 'react-native-typography';
import Search from 'react-native-search-box';

import Fuse from 'fuse.js';

import AdMob from '../../components/admob';
import VocabItem from '../../components/vocab-item';
import LessonItem from './components/lesson-item';

import { vocabs } from '../../utils/vocab-helpers';
import { range } from '../../utils/helpers';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  searchContainer: {
    marginBottom: 5,
    marginHorizontal: 10,
  },
  tabIndicator: {
    paddingHorizontal: 15,
    paddingTop: 6,
    paddingBottom: 6,
  },
  tabIndicatorText: {
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 12,
      },
    }),
    paddingBottom: 6,
    color: iOSColors.gray,
  },
  tabIndicatorSelectedText: {
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 12,
      },
    }),
    color: iOSColors.tealBlue,
  },
  tabIndicatorItem: {
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: '#F7F7F7',
  },
  tabIndicatorselectedItem: {
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: iOSColors.customGray,
  },
});

const lessonGroup = [
  {
    text: I18n.t('app.lessons.beginning-one'),
    list: range(1, 14), // [1, 13]
  },
  {
    text: I18n.t('app.lessons.beginning-two'),
    list: range(14, 26), // [14, 25]
  },
  {
    text: I18n.t('app.lessons.advanced-one'),
    list: range(26, 39), // [26, 38]
  },
  {
    text: I18n.t('app.lessons.advanced-two'),
    list: range(39, 51), // [39, 50]
  },
];

type Props = {};
export default class Lessons extends Component<Props> {
  static navigationOptions = {
    headerTitle: I18n.t('app.lessons.title'),
    headerStyle: {
      backgroundColor: '#F7F7F7',
      borderBottomWidth: 0,
    },
  };

  static propTypes = {
    navigation: PropTypes.shape({}).isRequired,
  };

  state = {
    searchText: '',
    searchResult: [],
  };

  onChangeText = searchText => {
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

  renderTabIndicator = () => (
    <PagerTabIndicator
      style={styles.tabIndicator}
      tabs={lessonGroup}
      textStyle={styles.tabIndicatorText}
      itemStyle={styles.tabIndicatorItem}
      selectedTextStyle={styles.tabIndicatorSelectedText}
      selectedItemStyle={styles.tabIndicatorselectedItem}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Search
            backgroundColor="#F7F7F7"
            inputStyle={{ backgroundColor: iOSColors.customGray }}
            titleCancelColor={iOSColors.blue}
            onChangeText={this.onChangeText}
            onFocus={this.onFocus}
            onCancel={this.onCancel}
            onDelete={this.onDelete}
            cancelTitle={I18n.t('app.search.cancel')}
            placeholder={I18n.t('app.search.title')}
          />
        </View>

        {!!this.state.searchText && (
          <FlatList
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
          <IndicatorViewPager
            style={{ flex: 1 }}
            indicator={this.renderTabIndicator()}
          >
            {lessonGroup.map(group => (
              <View key={group.text}>
                <FlatList
                  data={group.list}
                  keyExtractor={(item, index) => `${index}-${item}`}
                  renderItem={({ item }) => (
                    <LessonItem
                      item={item}
                      navigation={this.props.navigation}
                    />
                  )}
                />
              </View>
            ))}
          </IndicatorViewPager>
        )}

        <AdMob unitId={config.admob[`${Platform.OS}-lessons-banner`]} />
      </View>
    );
  }
}
