import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';

import { iOSColors } from 'react-native-typography';

const MATERIAL_BLUE = '#2196F3';

const styles = StyleSheet.create({
  button: {
    flex: 1,
    padding: 16,
  },
  buttonRaised: {
    borderRadius: 28,
    ...Platform.select({
      ios: {
        backgroundColor: iOSColors.tealBlue,
      },
      android: {
        backgroundColor: MATERIAL_BLUE,
        elevation: 3,
      },
    }),
  },
  buttonDisabled: {
    borderRadius: 28,
    ...Platform.select({
      ios: {
        backgroundColor: iOSColors.midGray,
      },
      android: {
        backgroundColor: MATERIAL_BLUE,
        elevation: 3,
      },
    }),
  },
  buttonFlat: {
  },
  buttonLabel: {
    textAlign: 'center',
    ...Platform.select({
      android: {
        fontWeight: 'bold',
      },
    }),
  },
  buttonLabelRaised: {
    color: '#FFFFFF',
  },
  buttonLabelDisabled: {
    color: '#FFFFFF',
  },
  buttonLabelFlat: {
    ...Platform.select({
      ios: {
        color: iOSColors.tealBlue,
      },
      android: {
        color: MATERIAL_BLUE,
      },
    }),
  },
});

const ButtonWrapper = ({ raised, disabled, onPress, children }) => {
  // All Android Buttons should have the ripple effect
  if (Platform.OS === 'android') {
    // Raised Android buttons need a white ripple
    if (raised) {
      return (
        <TouchableNativeFeedback
          onPress={onPress}
          background={TouchableNativeFeedback.Ripple('#FFF')}
        >
          <View style={[styles.button, styles.buttonRaised]}>
            {children}
          </View>
        </TouchableNativeFeedback>
      );
    }

    // Normal Android buttons get a gray ripple
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple()}
      >
        <View style={[styles.button, styles.buttonFLat]}>
          {children}
        </View>
      </TouchableNativeFeedback>
    );
  }

  // iOS raised buttons use TouchableHighlight
  if (raised) {
    const buttonStyles = [styles.button, styles.buttonRaised];
    if (disabled) {
      buttonStyles.push(styles.buttonDisabled);
    }

    return (
      <TouchableHighlight
        style={buttonStyles}
        underlayColor={iOSColors.midGray}
        onPress={onPress}
        disabled={disabled}
      >
        {children}
      </TouchableHighlight>
    );
  }

  // Normal iOS buttons use TouchableOpacity
  return (
    <TouchableOpacity
      style={[styles.button, styles.buttonFlat]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

class Button extends Component {
  static propTypes = {
    raised: PropTypes.bool,
    disabled: PropTypes.bool,
    title: PropTypes.string.isRequired,
  }

  static defaultProps = {
    raised: false,
    disabled: false,
  }

  renderLabel() {
    const titleStyles = [styles.buttonLabel];
    if (this.props.raised) {
      titleStyles.push(styles.buttonLabelRaised);
    } else if (this.props.disabled) {
      titleStyles.push(styles.buttonLabelDisabled);
    } else {
      titleStyles.push(styles.buttonLabelFlat);
    }

    let titleText = this.props.title;
    if (Platform.OS === 'android') {
      titleText = titleText.toUpperCase();
    }

    return <Text style={titleStyles}>{titleText}</Text>;
  }

  render() {
    return (
      <ButtonWrapper {...this.props}>
        {this.renderLabel()}
      </ButtonWrapper>
    );
  }
}

export default Button;
