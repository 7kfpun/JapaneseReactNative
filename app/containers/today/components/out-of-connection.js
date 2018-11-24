import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { iOSColors } from 'react-native-typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

import I18n from '../../../utils/i18n';
import { noop } from '../../../utils/helpers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '300',
    color: iOSColors.black,
    backgroundColor: 'transparent',
    lineHeight: 50,
  },
});

const OutOfConnection = props => (
  <TouchableOpacity style={{ flex: 1 }} onPress={() => props.onPress()}>
    <View style={styles.container}>
      <Ionicons name="ios-construct" size={30} color={iOSColors.black} />
      <Text style={styles.text}>{I18n.t('app.today.out_of_connection')}</Text>
    </View>
  </TouchableOpacity>
);

OutOfConnection.propTypes = {
  onPress: PropTypes.func,
};

OutOfConnection.defaultProps = {
  onPress: noop,
};

export default OutOfConnection;
