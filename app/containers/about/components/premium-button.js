import React from 'react';
import { func, shape } from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import I18n from '../../../utils/i18n';
import { shadow } from '../../../utils/styles';

const styles = StyleSheet.create({
  container: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '300',
    color: 'gray',
    marginTop: 8,
    textAlign: 'center',
  },
});

const PremiumButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate('premium')}>
    <View style={styles.container}>
      <Text style={styles.text}>{I18n.t('app.about.premium.title')}</Text>
      <Text style={styles.descriptionText}>
        {I18n.t('app.about.premium.button-description')}
      </Text>
    </View>
  </TouchableOpacity>
);

PremiumButton.propTypes = {
  navigation: shape({
    navigate: func.isRequired,
  }).isRequired,
};

export default PremiumButton;
