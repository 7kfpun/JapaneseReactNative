import {
  Platform,
} from 'react-native';

import { StackNavigator, TabNavigator } from 'react-navigation';
import { iOSColors } from 'react-native-typography';


import Main from './app/views/main';
import VocabList from './app/views/vocab-list';
import Assessment from './app/views/assessment';

if (!__DEV__) {
  console.log = () => {};
}

const App = StackNavigator({
  LessonList: { screen: Main },
  VocabList: { screen: VocabList },
  Assessment: { screen: Assessment },
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

module.exports = App;
