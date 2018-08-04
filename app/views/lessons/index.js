import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FlatList, Platform, ScrollView, StyleSheet } from 'react-native';

import { iOSColors } from 'react-native-typography';
import { IndicatorViewPager, PagerTabIndicator } from 'rn-viewpager';
import { SafeAreaView } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OneSignal from 'react-native-onesignal';

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
    fontSize: 16,
    paddingBottom: 6,
    color: iOSColors.gray,
  },
  tabIndicatorSelectedText: {
    fontSize: 16,
    paddingBottom: 6,
    color: iOSColors.tealBlue,
  },
});

const lessonGroup = [
  {
    text: I18n.t('app.main.beginning_one'),
    list: range(1, 14), // [1, 13]
  },
  {
    text: I18n.t('app.main.beginning_two'),
    list: range(14, 26), // [14, 25]
  },
  {
    text: I18n.t('app.main.advanced_one'),
    list: range(26, 39), // [26, 38]
  },
  {
    text: I18n.t('app.main.advanced_two'),
    list: range(39, 51), // [39, 50]
  },
];

type Props = {};
export default class Main extends Component<Props> {
  static propTypes = {
    navigation: PropTypes.shape({}).isRequired,
  };

  static navigationOptions = {
    headerBackTitle: null,
    title: 'みんなの日本語',
    tabBarIcon: ({ tintColor, focused }) => (
      <Ionicons
        name={focused ? 'ios-list' : 'ios-list-outline'}
        size={24}
        color={tintColor}
      />
    ),
  };

  state = {};

  componentDidMount() {
    OneSignal.init(config.onesignal, { kOSSettingsKeyAutoPrompt: true });

    // TODO:
    setTimeout(() => {
      this.setState({ androidFix: Math.random() });
    }, 1);
  }

  renderTabIndicator = () => (
    <PagerTabIndicator
      tabs={lessonGroup}
      textStyle={styles.tabIndicatorText}
      selectedTextStyle={styles.tabIndicatorSelectedText}
    />
  );

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <IndicatorViewPager
          key={this.state.androidFix}
          style={{ flex: 1 }}
          indicator={this.renderTabIndicator()}
        >
          {lessonGroup.map(group => (
            <ScrollView key={group.text}>
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
            </ScrollView>
          ))}
        </IndicatorViewPager>
        <AdMob unitId={config.admob[`japanese-${Platform.OS}-main-banner`]} />
      </SafeAreaView>
    );
  }
}
