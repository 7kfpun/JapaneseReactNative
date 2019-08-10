import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { IndicatorViewPager, PagerTabIndicator } from 'rn-viewpager';
import { iOSColors } from 'react-native-typography';

import Tile from './components/tile';

import AdMob from '../../components/admob';

import { colors } from '../../utils/styles';
import { seion, dakuon, youon } from '../../utils/kana';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme,
  },
  tabText: {
    fontWeight: '100',
    fontSize: 15,
  },
  headerRight: {
    fontSize: 16,
  },
  tabIndicator: {
    paddingHorizontal: 15,
    paddingTop: 6,
    paddingBottom: 6,
  },
  tabIndicatorText: {
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 12,
      },
    }),
    paddingBottom: 6,
    color: iOSColors.gray,
  },
  tabIndicatorSelectedText: {
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        fontSize: 12,
      },
    }),
    color: iOSColors.tealBlue,
  },
  tabIndicatorItem: {
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: '#F7F7F7',
  },
  tabIndicatorselectedItem: {
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: iOSColors.customGray,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const assessments = [
  {
    mode: 'seion',
    kana: seion,
  },
  {
    mode: 'dakuon',
    kana: dakuon,
  },
  {
    mode: 'youon',
    kana: youon,
  },
];

type Props = {};
export default class Kana extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || { position: 0 };
    const assessmentMode = assessments[params.position];

    return {
      headerTitle: I18n.t('app.kana.title'),
      headerRight: (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => {
              navigation.navigate('kana-assessment', {
                ...assessmentMode,
                nodeIndex: params.position,
                correctNumber: 0,
                total: 0,
              });
              tracker.logEvent('user-kana-goto-kana-assessment', {
                mode: assessmentMode.mode,
              });
            }}
          >
            <Text style={styles.headerRight}>{I18n.t('app.kana.quiz')}</Text>
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        backgroundColor: '#F7F7F7',
        borderBottomWidth: 0,
      },
    };
  };

  static propTypes = {
    navigation: PropTypes.shape({
      setParams: PropTypes.func,
    }).isRequired,
  };

  onPageSelected = position => {
    const { navigation } = this.props;
    navigation.setParams({ position });
    console.log('onPageSelected', position);
  };

  renderTabIndicator = () => (
    <PagerTabIndicator
      tabs={[
        {
          text: I18n.t('app.kana.seion'),
        },
        {
          text: I18n.t('app.kana.dakuon'),
        },
        {
          text: I18n.t('app.kana.youon'),
        },
      ]}
      style={styles.tabIndicator}
      textStyle={styles.tabIndicatorText}
      itemStyle={styles.tabIndicatorItem}
      selectedTextStyle={styles.tabIndicatorSelectedText}
      selectedItemStyle={styles.tabIndicatorselectedItem}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        <IndicatorViewPager
          style={{ flex: 1 }}
          indicator={this.renderTabIndicator()}
          onPageSelected={({ position }) => this.onPageSelected(position)}
        >
          {assessments.map((assessment, i) => (
            <View key={i}>
              <ScrollView>
                {assessment.kana.map((row, j) => (
                  <View key={`${assessment.mode}-${j}`} style={styles.row}>
                    {row.map((item, k) => (
                      <Tile
                        key={`${assessment.mode}-${j}-${k}`}
                        itemsPerRow={row.length}
                        hiragana={item[0]}
                        katakana={item[1]}
                        romaji={item[2]}
                      />
                    ))}
                  </View>
                ))}
              </ScrollView>
            </View>
          ))}
        </IndicatorViewPager>

        <AdMob unitId={config.admob[`${Platform.OS}-kana-banner`]} />
      </View>
    );
  }
}
