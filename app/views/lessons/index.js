import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FlatList, Platform, StyleSheet, View } from 'react-native';

import { IndicatorViewPager, PagerTabIndicator } from 'rn-viewpager';
import { iOSColors } from 'react-native-typography';
import store from 'react-native-simple-store';

import AdMob from '../../elements/admob';
import LessonItem from '../../elements/lesson-item';

import { range } from '../../utils/helpers';
import I18n from '../../utils/i18n';

import { config } from '../../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
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
    paddingBottom: 6,
    color: iOSColors.tealBlue,
  },
});

const lessonGroup = [
  {
    text: I18n.t('app.lessons.beginning_one'),
    list: range(1, 14), // [1, 13]
  },
  {
    text: I18n.t('app.lessons.beginning_two'),
    list: range(14, 26), // [14, 25]
  },
  {
    text: I18n.t('app.lessons.advanced_one'),
    list: range(26, 39), // [26, 38]
  },
  {
    text: I18n.t('app.lessons.advanced_two'),
    list: range(39, 51), // [39, 50]
  },
];

type Props = {};
export default class Lessons extends Component<Props> {
  static navigationOptions = {
    headerTitle: I18n.t('app.lessons.title'),
  };

  static propTypes = {
    navigation: PropTypes.shape({}).isRequired,
  };

  state = {
    isPremium: false,
  };

  componentDidMount() {
    store.get('isPremium').then(isPremium => this.setState({ isPremium }));
  }

  renderTabIndicator = () => (
    <PagerTabIndicator
      tabs={lessonGroup}
      textStyle={styles.tabIndicatorText}
      selectedTextStyle={styles.tabIndicatorSelectedText}
    />
  );

  render() {
    const { isPremium } = this.state;

    return (
      <View style={styles.container}>
        <IndicatorViewPager
          style={{ flex: 1 }}
          indicator={this.renderTabIndicator()}
        >
          {lessonGroup.map(group => (
            <View key={group.text}>
              <FlatList
                style={styles.list}
                data={group.list}
                keyExtractor={(item, index) => `${index}-${item}`}
                renderItem={({ item, index }) => (
                  <LessonItem
                    index={index}
                    item={item}
                    navigation={this.props.navigation}
                  />
                )}
              />
            </View>
          ))}
        </IndicatorViewPager>

        {!isPremium && (
          <AdMob
            unitId={config.admob[`japanese-${Platform.OS}-lessons-banner`]}
          />
        )}
      </View>
    );
  }
}
