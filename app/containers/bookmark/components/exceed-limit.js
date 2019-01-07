import React from 'react';
import { number } from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import I18n from '../../../utils/i18n';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 20,
    padding: 25,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '300',
    color: 'gray',
    marginTop: 8,
  },
});

const ExceedLimit = ({ max }) => (
  <View style={styles.container}>
    <Text style={styles.text}>
      {I18n.t('app.bookmark.too-many', { number: max })}
    </Text>
  </View>
);

ExceedLimit.propTypes = {
  max: number,
};

ExceedLimit.defaultProps = {
  max: 20,
};

export default ExceedLimit;
