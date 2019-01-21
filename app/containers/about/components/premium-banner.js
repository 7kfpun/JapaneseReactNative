import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import Ionicons from 'react-native-vector-icons/Ionicons';

import I18n from '../../../utils/i18n';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  icon: {
    marginBottom: 15,
  },
  text: {
    fontSize: 18,
    lineHeight: 20,
    color: 'white',
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 20,
    color: 'white',
    marginTop: 15,
    textAlign: 'center',
  },
});

const info = [
  {
    icon: 'ios-eye-off',
    text: I18n.t('app.about.premium-banner.adfree'),
    description: I18n.t('app.about.premium-banner.adfree-description'),
    color: '#233D4D',
  },
  {
    icon: 'ios-headset',
    text: I18n.t('app.about.premium-banner.listening'),
    description: I18n.t('app.about.premium-banner.listening-description'),
    color: '#E16F7C',
  },
  {
    icon: 'ios-clipboard',
    text: I18n.t('app.about.premium-banner.quiz'),
    description: I18n.t('app.about.premium-banner.quiz-description'),
    color: '#E9B44C',
  },
  {
    icon: 'ios-chatboxes',
    text: I18n.t('app.about.premium-banner.read-all'),
    description: I18n.t('app.about.premium-banner.read-all-description'),
    color: '#50A2A7',
  },
  {
    icon: 'ios-bookmarks',
    text: I18n.t('app.about.premium-banner.bookmark'),
    description: I18n.t('app.about.premium-banner.bookmark-description'),
    color: '#C75000',
  },
];

const renderDotIndicator = () => <PagerDotIndicator pageCount={info.length} />;

const PremiumBanner = () => (
  <IndicatorViewPager
    style={{ height: 280 }}
    indicator={renderDotIndicator()}
    autoPlayEnable
    autoPlayInterval={6000}
  >
    {info.map(item => (
      <View
        key={item.color}
        style={[styles.container, { backgroundColor: item.color }]}
      >
        <Ionicons
          style={styles.icon}
          name={item.icon}
          size={60}
          color="white"
        />
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.descriptionText}>{item.description}</Text>
      </View>
    ))}
  </IndicatorViewPager>
);

export default PremiumBanner;
