import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { iOSColors } from 'react-native-typography';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
    backgroundColor: 'white',
  },
  disabled: {
    backgroundColor: iOSColors.lightGray,
  },
  body: {
    paddingVertical: 15,
    paddingRight: 15,
  },
  borderTop: {
    borderTopWidth: 0.5,
    borderTopColor: iOSColors.midGray,
  },
  borderBottom: {
    borderBottomWidth: 0.5,
    borderBottomColor: iOSColors.midGray,
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  descriptionText: {
    fontSize: 12,
    fontWeight: '300',
    marginTop: 8,
    color: 'black',
  },
});

const Row = ({
  text,
  description,
  first,
  last,
  onPress,
  containerStyle,
  disabled,
}) => (
  <TouchableOpacity
    style={[
      containerStyle,
      styles.container,
      first ? styles.borderTop : {},
      last ? styles.borderBottom : {},
      disabled ? styles.disabled : {},
    ]}
    onPress={() => !disabled && onPress()}
  >
    <View
      style={[
        styles.body,
        !first && !last ? styles.borderBottom : {},
        first && !last ? styles.borderBottom : {},
      ]}
    >
      {text !== '' && <Text style={styles.text}>{text}</Text>}
      {description !== '' && (
        <Text style={styles.descriptionText}>{description}</Text>
      )}
    </View>
  </TouchableOpacity>
);

Row.propTypes = {
  containerStyle: PropTypes.shape({}),
  text: PropTypes.string,
  description: PropTypes.string,
  onPress: PropTypes.func,
  first: PropTypes.bool,
  last: PropTypes.bool,
  disabled: PropTypes.bool,
};

Row.defaultProps = {
  containerStyle: {},
  onPress: () => {},
  text: '',
  description: '',
  first: true,
  last: true,
  disabled: false,
};

export default Row;
