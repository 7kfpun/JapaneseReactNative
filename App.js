import React from 'react';

import { StackNavigator, TabNavigator } from 'react-navigation';
import { iOSColors } from 'react-native-typography';

import About from './app/views/about';
import Assessment from './app/views/lessons/assessment';
import Feedback from './app/views/feedback';
import Lessons from './app/views/lessons';
import ReadAll from './app/views/lessons/read-all';
import Search from './app/views/search';
import Today from './app/views/today';
import VocabList from './app/views/lessons/vocab-list';

import tracker from './app/utils/tracker';

if (!__DEV__) {
  console.log = () => {};
}

const stackOptions = {
  swipeEnabled: false,
  animationEnabled: true,
  navigationOptions: {
    headerStyle: {
      backgroundColor: iOSColors.tealBlue,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
};

const AppTab = TabNavigator({
  today: {
    screen: StackNavigator({
      today: { screen: Today },
    },
    stackOptions),
  },
  lessons: {
    screen: StackNavigator({
      lessons: { screen: Lessons },
      'vocab-list': { screen: VocabList },
      assessment: { screen: Assessment },
      'read-all': { screen: ReadAll },
      'vocab-feedback': { screen: Feedback },
    },
    stackOptions),
  },
  search: {
    screen: StackNavigator({
      search: { screen: Search },
    },
    stackOptions),
  },
  about: {
    screen: StackNavigator({
      about: { screen: About },
      feedback: { screen: Feedback },
    },
    stackOptions),
  },
}, {
  tabBarOptions: {
    activeTintColor: iOSColors.tealBlue,
    inactiveTintColor: iOSColors.black,
    // showIcon and pressColor are for Android
    showIcon: true,
    pressColor: '#E0E0E0',
    labelStyle: {
      fontSize: 10,
      paddingBottom: 2,
    },
    indicatorStyle: {
      backgroundColor: iOSColors.tealBlue,
    },
    style: {
      backgroundColor: 'white',
    },
  },
  tabBarPosition: 'bottom',

  navigationOptions: {
    headerStyle: {
      backgroundColor: iOSColors.tealBlue,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});

console.ignoredYellowBox = [
  'NetInfo\'s "change" event is deprecated. Listen to the "connectionChange" event instead.',
  'Warning: Can only update a mounted or mounting component.',
  'Each ViewPager child must be a <View>. Was ScrollView',
  'Sending `tts-start` with no listeners registered.',
  'Sending `tts-progress` with no listeners registered.',
  'Sending `tts-finish` with no listeners registered.',
  'Sending `tts-cancel` with no listeners registered.',
  'Method `jumpToIndex` is deprecated.',
];

// gets the current screen from navigation state
function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

export default () => (
  <AppTab
    onNavigationStateChange={(prevState, currentState) => {
      const currentScreen = getCurrentRouteName(currentState);
      const prevScreen = getCurrentRouteName(prevState);

      if (prevScreen !== currentScreen) {
        console.log(currentScreen);
        tracker.view(currentScreen);
      }
    }}
  />
);
