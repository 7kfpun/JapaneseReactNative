import React from 'react';
import { func, string } from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import I18n from '../../../utils/i18n';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  leftBlock: {},
  rightBlock: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '300',
    color: 'gray',
    marginTop: 8,
  },
});

const LifetimeButton = ({ currency, price, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.container}>
      <View style={styles.leftBlock}>
        <Text style={styles.text}>{I18n.t('app.about.premium.lifetime')}</Text>
        <Text style={styles.descriptionText}>
          {I18n.t('app.about.premium.lifetime-description')}
        </Text>
      </View>
      <View style={styles.rightBlock}>
        <Text style={styles.text}>{price}</Text>
        <Text style={styles.descriptionText}>{currency}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

LifetimeButton.propTypes = {
  price: string.isRequired,
  currency: string.isRequired,
  onPress: func.isRequired,
};

export default LifetimeButton;
