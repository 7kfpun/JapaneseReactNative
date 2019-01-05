import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  AsyncStorage,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import store from 'react-native-simple-store';

import AdMob from '../../components/admob';
import VocabItem from '../../components/vocab-item';

import { vocabsMapper } from '../../utils/vocab-helpers';

import { config } from '../../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
});

type Props = {};
export default class BookmarkList extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const {
      state: {
        params: { starCount },
      },
    } = navigation;

    return {
      headerTitle: '⭐'.repeat(starCount),
    };
  };

  static propTypes = {
    navigation: PropTypes.shape({}).isRequired,
  };

  state = {
    list: [],
  };

  componentDidMount() {
    this.getStore();
  }

  getStore = async () => {
    const {
      navigation: {
        state: {
          params: { starCount },
        },
      },
    } = this.props;

    const keys = await AsyncStorage.getAllKeys();
    const list = [];

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const prefix = 'lessons.assessment.';
      if (key.startsWith(prefix)) {
        const count = await store.get(key);
        if (count === starCount) {
          list.push(key.replace(prefix, ''));
        }
      }
    }

    this.setState({ list });
  };

  render() {
    const {
      navigation: {
        state: {
          params: { starCount },
        },
      },
    } = this.props;
    const { list } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={{ alignSelf: 'stretch' }}>
          <FlatList
            style={styles.list}
            data={list}
            keyExtractor={(item, index) => `${index}-${item}`}
            renderItem={({ item, index }) =>
              vocabsMapper[item] && (
                <VocabItem
                  index={index}
                  item={vocabsMapper[item]}
                  lesson={vocabsMapper[item].lesson}
                  isShowLesson={true}
                />
              )
            }
          />
        </ScrollView>

        <AdMob unitId={config.admob[`${Platform.OS}-bookmark-banner`]} />
      </View>
    );
  }
}
