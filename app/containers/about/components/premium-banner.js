import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';

import I18n from '../../../utils/i18n';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '300',
    color: 'white',
    marginTop: 5,
    textAlign: 'center',
  },
});

const info = [
  {
    text: I18n.t('app.about.premium-banner.adfree'),
    description: I18n.t('app.about.premium-banner.adfree-description'),
    color: '#233D4D',
  },
  {
    text: I18n.t('app.about.premium-banner.listening'),
    description: I18n.t('app.about.premium-banner.listening-description'),
    color: '#E16F7C',
  },
  {
    text: I18n.t('app.about.premium-banner.quiz'),
    description: I18n.t('app.about.premium-banner.quiz-description'),
    color: '#E9B44C',
  },
  {
    text: I18n.t('app.about.premium-banner.read-all'),
    description: I18n.t('app.about.premium-banner.read-all-description'),
    color: '#50A2A7',
  },
  {
    text: I18n.t('app.about.premium-banner.bookmark'),
    description: I18n.t('app.about.premium-banner.bookmark-description'),
    color: '#C75000',
  },
];

const renderDotIndicator = () => <PagerDotIndicator pageCount={info.length} />;

const PremiumBanner = () => (
  <IndicatorViewPager
    style={{ height: 200 }}
    indicator={renderDotIndicator()}
    autoPlayEnable
    autoPlayInterval={6000}
  >
    {info.map(item => (
      <View
        key={item.color}
        style={[styles.container, { backgroundColor: item.color }]}
      >
        <Text style={styles.text}>{item.text}</Text>
        <Text style={styles.descriptionText}>{item.description}</Text>
      </View>
    ))}
  </IndicatorViewPager>
);

export default PremiumBanner;
