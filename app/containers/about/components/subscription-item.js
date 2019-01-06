import React from 'react';
import { bool, func, string } from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { iOSColors } from 'react-native-typography';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width / 3 - 20,
    backgroundColor: 'white',
    margin: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 2,
  },
  periodNumberText: {
    fontSize: 28,
    fontWeight: '500',
  },
  periodUnitText: {
    fontSize: 14,
    fontWeight: '300',
    marginTop: 10,
  },
  localizedPriceText: {
    fontSize: 14,
    fontWeight: '300',
    marginTop: 5,
  },
});

const SubscriptionItem = ({
  onPress,
  periodNumber,
  periodUnit,
  localizedPrice,
  isSelected,
}) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={[
        styles.container,
        { borderColor: isSelected ? iOSColors.tealBlue : iOSColors.white },
      ]}
    >
      <Text style={styles.periodNumberText}>{periodNumber}</Text>
      <Text style={styles.periodUnitText}>{periodUnit}</Text>
      <Text style={styles.localizedPriceText}>{localizedPrice}</Text>
    </View>
  </TouchableOpacity>
);

SubscriptionItem.propTypes = {
  onPress: func.isRequired,
  periodNumber: string.isRequired,
  periodUnit: string.isRequired,
  localizedPrice: string.isRequired,
  isSelected: bool.isRequired,
};

export default SubscriptionItem;
