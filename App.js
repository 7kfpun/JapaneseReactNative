import React from 'react';

import { StackNavigator } from 'react-navigation';
import { iOSColors } from 'react-native-typography';

import Main from './app/views/main';
import VocabList from './app/views/vocab-list';
import Assessment from './app/views/assessment';
import Feedback from './app/views/feedback';

import tracker from './app/utils/tracker';

if (!__DEV__) {
  console.log = () => {};
}

const App = StackNavigator({
  main: { screen: Main },
  'vocab-list': { screen: VocabList },
  assessment: { screen: Assessment },
  feedback: { screen: Feedback },
}, {
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
  // tabBarOptions: {
  //   showIcon: true,
  //   pressColor: '#E0E0E0',
  //   labelStyle: {
  //     fontSize: 12,
  //     paddingBottom: 4,
  //   },
  //   style: {
  //     backgroundColor: iOSColors.tealBlue,
  //   },
  // },
});

console.ignoredYellowBox = [
  'NetInfo\'s "change" event is deprecated. Listen to the "connectionChange" event instead.',
  'Warning: Can only update a mounted or mounting component.',
  'Each ViewPager child must be a <View>. Was ScrollView',
  'Sending `tts-start` with no listeners registered.',
  'Sending `tts-progress` with no listeners registered.',
  'Sending `tts-finish` with no listeners registered.',
  'Sending `tts-cancel` with no listeners registered.',
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
  <App
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
