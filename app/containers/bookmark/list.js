import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  AsyncStorage,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';
import { SwipeListView } from 'react-native-swipe-list-view';
import store from 'react-native-simple-store';

import AdMob from '../../components/admob';
import VocabItem from '../../components/vocab-item';

import ExceedLimit from './components/exceed-limit';

import { getPremiumInfo } from '../../utils/payment';
import { vocabsMapper } from '../../utils/vocab-helpers';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

const MAX_VOCABULARIES = 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  empty: {
    paddingTop: 100,
    padding: 20,
  },
  hiddenRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 6,
  },
  hiddenText: {
    fontSize: 14,
    color: 'white',
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '300',
    color: iOSColors.gray,
    lineHeight: 40,
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
      headerStyle: {
        backgroundColor: '#F7F7F7',
        borderBottomWidth: 0,
      },
    };
  };

  static propTypes = {
    navigation: PropTypes.shape({}).isRequired,
  };

  state = {
    isPremium: false,
    list: [],
  };

  componentDidMount() {
    this.getStore();
    this.getStoreSubscription();
  }

  getStoreSubscription = async () => {
    const premiumInfo = await getPremiumInfo();
    this.setState(premiumInfo);
  };

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

  removeItem = item => {
    const {
      navigation: {
        state: {
          params: { starCount },
        },
      },
    } = this.props;

    const { list } = this.state;
    const prefix = 'lessons.assessment.';
    console.log(`${prefix}${item}`, item);
    store.delete(`${prefix}${item}`);
    this.setState({ list: list.filter(i => i !== item) });
    tracker.logEvent('user-bookmark-remove-item', { count: starCount });
  };

  render() {
    const { isPremium, list } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView>
          <SwipeListView
            style={styles.list}
            useFlatList
            data={isPremium ? list : list.slice(0, MAX_VOCABULARIES)}
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
            renderHiddenItem={({ item }) => (
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => this.removeItem(item)}
              >
                <View style={styles.hiddenRow}>
                  <Text style={styles.hiddenText}>
                    {I18n.t('app.bookmark.remove')}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            rightOpenValue={-70}
            disableRightSwipe
          />

          {!isPremium && list.length > MAX_VOCABULARIES && (
            <ExceedLimit max={MAX_VOCABULARIES} />
          )}

          {list.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.text}>
                {I18n.t('app.bookmark.description')}
              </Text>
            </View>
          )}
        </ScrollView>

        <AdMob unitId={config.admob[`${Platform.OS}-bookmark-banner`]} />
      </View>
    );
  }
}
