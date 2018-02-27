import React, { Component } from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { IndicatorViewPager, PagerTabIndicator } from 'rn-viewpager';
import { SafeAreaView } from 'react-navigation';
import firebase from 'react-native-firebase';

import AdMob from '../elements/admob';
import LessonItem from '../elements/lesson-item';

import { config } from '../config';

const advert = firebase.admob().interstitial(config.admob[`japanese-${Platform.OS}-popup`]);

const { AdRequest } = firebase.admob;
const request = new AdRequest();
request.addKeyword('learning').addKeyword('japanese');

advert.loadAd(request.build());

advert.on('onAdLoaded', () => {
  console.log('Advert ready to show.');
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabText: {
    fontSize: 16,
    paddingBottom: 6,
  },
});

const lessonGroup = [{
  text: 'Beg. I',
  name: '初級 I',
  list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
}, {
  text: 'Beg. II',
  name: '初級 II',
  list: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
}, {
  text: 'Adv. I',
  name: '進級 I',
  list: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
}, {
  text: 'Adv. II',
  name: '進級 II',
  list: [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
}];

type Props = {};
// LessonList
export default class Main extends Component<Props> {
  static navigationOptions = {
    headerBackTitle: null,
    title: 'みんなの日本語',
  };

  componentDidMount() {
    setTimeout(() => {
      if (advert.isLoaded()) {
        advert.show();
      } else {
        console.log('asdasdasd');
      }
    }, 1000);
  }

  renderTabIndicator = () => <PagerTabIndicator tabs={lessonGroup} textStyle={styles.tabText} selectedTextStyle={styles.tabText} />

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <IndicatorViewPager
          style={{ flex: 1 }}
          indicator={this.renderTabIndicator()}
        >
          {lessonGroup.map(group => (
            <ScrollView key={Math.random()}>
              <FlatList
                style={styles.list}
                data={group.list}
                keyExtractor={(item, index) => `${index}-${item}`}
                renderItem={({ item, index }) => <LessonItem index={index} item={item} navigation={this.props.navigation} />}
              />
            </ScrollView>
          ))}

        </IndicatorViewPager>
        <AdMob unitId={config.admob[`japanese-${Platform.OS}-main-banner`]} />
      </SafeAreaView>
    );
  }
}
