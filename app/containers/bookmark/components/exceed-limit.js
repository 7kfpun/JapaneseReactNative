import React from 'react';
import { func, number } from 'prop-types';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

import { noop } from '../../../utils/helpers';
import I18n from '../../../utils/i18n';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 40,
    marginHorizontal: 15,
    padding: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '300',
    color: 'gray',
    marginTop: 8,
  },
});

const ExceedLimit = ({ max, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.container}>
      <Text style={styles.text}>
        {I18n.t('app.bookmark.too-many', { number: max })}
      </Text>
    </View>
  </TouchableOpacity>
);

ExceedLimit.propTypes = {
  max: number,
  onPress: func,
};

ExceedLimit.defaultProps = {
  max: 20,
  onPress: noop,
};

export default ExceedLimit;
