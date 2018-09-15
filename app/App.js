import React from 'react';

import { Platform, ToastAndroid, YellowBox } from 'react-native';

import { StackNavigator, TabNavigator } from 'react-navigation';
import { iOSColors } from 'react-native-typography';
import Tts from 'react-native-tts';

import About from './views/about';
import Assessment from './views/lessons/assessment';
import Feedback from './views/feedback';
import Kana from './views/kana';
import KanaAssessment from './views/kana/assessment';
import Lessons from './views/lessons';
import ReadAll from './views/lessons/read-all';
import Search from './views/search';
import Today from './views/today';
import VocabList from './views/lessons/vocab-list';

import tracker from './utils/tracker';
import I18n from './utils/i18n';

if (!__DEV__) {
  console.log = () => {};
}

Tts.getInitStatus().then(
  () => {
    Tts.setDefaultRate(0.4);
    Tts.setDucking(true);

    if (!I18n.isJaVoiceSupport && Platform.OS === 'android') {
      setTimeout(() => {
        ToastAndroid.show(I18n.t('app.common.tts_required'), ToastAndroid.LONG);
      }, 5000);
    }
  },
  err => {
    ToastAndroid.show(I18n.t('app.common.tts_required'), ToastAndroid.LONG);
    if (err.code === 'no_engine') {
      try {
        Tts.requestInstallEngine();
      } catch (e) {
        console.log('Cannot requestInstallEngine');
      }
    }
  }
);

const stackOptions = {
  swipeEnabled: false,
  animationEnabled: true,
  navigationOptions: {
    headerStyle: {
      backgroundColor: iOSColors.tealBlue,
      // backgroundColor: '#F7F7F7',
      // borderBottomWidth: 0,
    },
    headerTintColor: iOSColors.white,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
};

const AppTab = TabNavigator(
  {
    today: {
      screen: StackNavigator(
        {
          today: { screen: Today },
          'vocab-feedback': { screen: Feedback },
        },
        stackOptions
      ),
    },
    kana: {
      screen: StackNavigator(
        {
          kana: { screen: Kana },
          'kana-assessment': { screen: KanaAssessment },
        },
        stackOptions
      ),
    },
    lessons: {
      screen: StackNavigator(
        {
          lessons: { screen: Lessons },
          'vocab-list': { screen: VocabList },
          assessment: { screen: Assessment },
          'read-all': { screen: ReadAll },
          'vocab-feedback': { screen: Feedback },
        },
        stackOptions
      ),
    },
    search: {
      screen: StackNavigator(
        {
          search: { screen: Search },
        },
        stackOptions
      ),
    },
    about: {
      screen: StackNavigator(
        {
          about: { screen: About },
          feedback: { screen: Feedback },
        },
        stackOptions
      ),
    },
  },
  {
    tabBarOptions: {
      activeTintColor: iOSColors.tealBlue,
      inactiveTintColor: iOSColors.black,
      // showIcon and pressColor are for Android
      showIcon: true,
      pressColor: '#E0E0E0',
      labelStyle: {
        ...Platform.select({
          ios: {
            fontSize: 10,
            paddingBottom: 2,
            paddingTop: 2,
          },
          android: {
            fontSize: 6,
            paddingBottom: 0,
            paddingTop: 0,
          },
        }),
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
  }
);

YellowBox.ignoreWarnings = [
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
  <AppTab
    onNavigationStateChange={(prevState, currentState) => {
      const currentScreen = getCurrentRouteName(currentState);
      const prevScreen = getCurrentRouteName(prevState);

      console.log('prevScreen', prevScreen, 'currentScreen', currentScreen);
      if (prevScreen !== currentScreen) {
        // pause tts if changing from read-all view to others
        if (prevScreen === 'read-all') {
          Tts.pause();
        }

        tracker.view(currentScreen);
      }
    }}
  />
);
