import { iOSColors } from 'react-native-typography';

const shadow = {
  shadowColor: '#E0E0E0',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 1,
};

const colors = {
  theme: '#F7F7F7',
  black: '#000000',
  gray: '#212121',
  midGray: '#484848',
  silverGray: iOSColors.midGray,
  lightGray: iOSColors.lightGray,
  white: '#FFFFFF',
};

exports.shadow = shadow;
exports.colors = colors;
