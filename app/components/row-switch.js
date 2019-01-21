import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Switch, Text, View } from 'react-native';

import { iOSColors } from 'react-native-typography';

import { noop } from '../utils/helpers';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
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

const RowSwitch = ({
  text,
  description,
  first,
  last,
  onValueChange,
  containerStyle,
  disabled,
  value,
}) => (
  <View
    style={[
      containerStyle,
      styles.container,
      first ? styles.borderTop : {},
      last ? styles.borderBottom : {},
    ]}
  >
    <View>
      {text !== '' && <Text style={styles.text}>{text}</Text>}
      {description !== '' && (
        <Text style={styles.descriptionText}>{description}</Text>
      )}
    </View>

    <Switch
      onValueChange={onValueChange}
      value={value}
      trackColor="#E0E0E0"
      disabled={disabled}
    />
  </View>
);

RowSwitch.propTypes = {
  containerStyle: PropTypes.shape({}),
  text: PropTypes.string,
  description: PropTypes.string,
  onValueChange: PropTypes.func,
  first: PropTypes.bool,
  last: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.bool,
};

RowSwitch.defaultProps = {
  containerStyle: {},
  onValueChange: noop,
  text: '',
  description: '',
  first: true,
  last: true,
  disabled: false,
  value: false,
};

export default RowSwitch;
