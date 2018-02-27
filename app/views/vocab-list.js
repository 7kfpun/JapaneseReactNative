import React, { Component } from 'react';
import {
  Button,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import { SafeAreaView } from 'react-navigation';

import AdMob from '../elements/admob';
import VocabItem from '../elements/vocab-item';

import { items as vocabs } from '../utils/items';
import tracker from '../utils/tracker';

import { config } from '../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type Props = {};
// LessonList
export default class VocabList extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerBackTitle: null,
      headerTitle: `Lesson ${params.item}`,
      headerRight: (
        <Button
          onPress={() => {
            navigation.navigate('Assessment', { item: params.item });
            tracker.logEvent('Assessment', { item: params.item });
          }}
          title="Learn"
          color={iOSColors.white}
        />
      ),
    };
  };

  state = {
    vocabs: [],
  }

  componentDidMount() {
    const { item } = this.props.navigation.state.params;
    this.setState({ vocabs: vocabs[`lesson${item}`].text });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <FlatList
            style={styles.list}
            data={this.state.vocabs}
            keyExtractor={(item, index) => `${index}-${item}`}
            renderItem={({ item, index }) => (
              <VocabItem
                index={index}
                navigation={this.props.navigation}
                item={item}
              />
            )}
          />
        </ScrollView>
        <AdMob unitId={config.admob[`japanese-${Platform.OS}-vocablist-banner`]} />
      </SafeAreaView>
    );
  }
}
