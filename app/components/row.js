import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors } from '../utils/styles';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
    backgroundColor: 'white',
  },
  disabled: {
    backgroundColor: colors.lightGray,
  },
  body: {
    paddingVertical: 15,
    paddingRight: 15,
  },
  borderTop: {
    borderTopWidth: 0.5,
    borderTopColor: colors.lightGray,
  },
  borderBottom: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightGray,
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '300',
    marginTop: 8,
    color: colors.gray,
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
  selected,
  selectedIcon,
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
      {text !== '' && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={styles.text}>{text}</Text>
          <Ionicons
            name={selectedIcon}
            size={20}
            color={selected ? colors.black : colors.white}
          />
        </View>
      )}
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
  selected: PropTypes.bool,
  selectedIcon: PropTypes.string,
};

Row.defaultProps = {
  containerStyle: {},
  onPress: () => {},
  text: '',
  description: '',
  first: true,
  last: true,
  disabled: false,
  selected: false,
  selectedIcon: 'ios-checkmark',
};

export default Row;
