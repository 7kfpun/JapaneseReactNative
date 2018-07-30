import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { IndicatorViewPager, PagerTabIndicator } from 'rn-viewpager';
import { iOSColors } from 'react-native-typography';

import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-navigation';

import Tile from './tile';

import AdMob from '../../elements/admob';

import I18n from '../../utils/i18n';
import { seion, dakuon, youon } from '../../utils/kana';

import { config } from '../../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabText: {
    fontWeight: '100',
    fontSize: 15,
  },
  tabIndicatorText: {
    fontSize: 16,
    paddingBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

type Props = {};
export default class About extends Component<Props> {
  static propTypes = {}

  static navigationOptions = {
    title: I18n.t('app.kana.title'),
    tabBarLabel: I18n.t('app.kana.title'),
    tabBarIcon: ({ tintColor, focused }) => (<Text
      style={[
        styles.tabText, { color: focused ? tintColor : iOSColors.black },
      ]}
    >{'あ'}</Text>),
  };

  state = {}

  renderTabIndicator = () => (<PagerTabIndicator
    tabs={[{
      text: I18n.t('app.kana.seion'),
    }, {
      text: I18n.t('app.kana.dakuon'),
    }, {
      text: I18n.t('app.kana.youon'),
    }]}
    textStyle={styles.tabIndicatorText}
    selectedTextStyle={styles.tabIndicatorText}
  />)

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <IndicatorViewPager
          key={this.state.androidFix}
          style={{ flex: 1 }}
          indicator={this.renderTabIndicator()}
        >
          <ScrollView>
            {seion.map((row, i) => (<View key={i} style={styles.row}>
              {row.map((item, j) => (<Tile key={j} itemsPerRow={5} hiragana={item[0]} katakana={item[1]} romaji={item[2]} />))}
            </View>))}
          </ScrollView>

          <ScrollView>
            {dakuon.map((row, i) => (<View key={i} style={styles.row}>
              {row.map((item, j) => (<Tile key={j} itemsPerRow={5} hiragana={item[0]} katakana={item[1]} romaji={item[2]} />))}
            </View>))}
          </ScrollView>

          <ScrollView>
            {youon.map((row, i) => (<View key={i} style={styles.row}>
              {row.map((item, j) => (<Tile key={j} itemsPerRow={3} hiragana={item[0]} katakana={item[1]} romaji={item[2]} />))}
            </View>))}
          </ScrollView>
        </IndicatorViewPager>

        <AdMob unitId={config.admob[`japanese-${Platform.OS}-about-banner`]} />
      </SafeAreaView>
    );
  }
}
