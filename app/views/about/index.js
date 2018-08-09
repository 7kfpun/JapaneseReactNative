import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Alert, Platform, StyleSheet, ScrollView, View } from 'react-native';

import { SafeAreaView } from 'react-navigation';
import * as RNIap from 'react-native-iap';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OneSignal from 'react-native-onesignal';
import RNRestart from 'react-native-restart';
import store from 'react-native-simple-store';

import NotificationSetting from './components/notification-setting';
import AdMob from '../../elements/admob';
import Row from '../../elements/row';

import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

const itemSkus = Platform.select({
  ios: config.inAppProducts,
  android: config.inAppProducts,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
});

type Props = {};
export default class About extends Component<Props> {
  static propTypes = {
    navigation: PropTypes.shape({}).isRequired,
  };

  static navigationOptions = {
    title: I18n.t('app.about.title'),
    tabBarLabel: I18n.t('app.about.title'),
    tabBarIcon: ({ tintColor, focused }) => (
      <Ionicons
        name={focused ? 'ios-chatboxes' : 'ios-chatboxes-outline'}
        size={20}
        color={tintColor}
      />
    ),
  };

  state = {
    productList: [],
    // purchasedProduct: [],
    purchasedProductIds: [],
    refreshing: false,
    isPremium: false,
  };

  componentDidMount() {
    OneSignal.init(config.onesignal, { kOSSettingsKeyAutoPrompt: true });

    this.requestProducts();

    store.get('isPremium').then(isPremium => this.setState({ isPremium }));
  }

  getProducts = async () => {
    try {
      await RNIap.prepare();
      const products = await RNIap.getProducts(itemSkus);
      console.log('getProducts', products);
      this.setState({ productList: products, refreshing: false });
    } catch (err) {
      console.warn(err);
    }
  };

  getAvailablePurchases = async () => {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      console.log('getAvailablePurchases', purchases);
      if (purchases && purchases.length > 0) {
        this.setState({
          // purchasedProduct: purchases,
          purchasedProductIds: purchases.map(item => item.productId),
          refreshing: false,
        });
      }
    } catch (err) {
      console.log('Get available error', err.code, err.message);
      console.warn(err.code, err.message);
      return false;
    }
  };

  buySubscribeItem = async sku => {
    try {
      console.log('buySubscribeItem:', sku);
      const purchase = await RNIap.buySubscription(sku);
      console.info('Purchase result', purchase);
      if (purchase.productId === config.inAppProducts[0]) {
        store.save('isPremium', true);

        Alert.alert(
          'Thanks for your purchase',
          'You are our premium user now',
          [{ text: 'OK', onPress: () => RNRestart.Restart() }],
          { cancelable: false }
        );
      }

      // this.requestProducts();
    } catch (err) {
      console.warn('Purchase result error', err.code, err.message);
    }
  };

  requestProducts() {
    this.getProducts();
    // this.getAvailablePurchases();
  }

  render() {
    const { navigation } = this.props;

    const { isPremium } = this.state;

    const { productList, purchasedProductIds } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{ alignSelf: 'stretch' }}>
          <View style={{ marginTop: 10 }}>
            {productList.map((product, i) => (
              <Row
                key={product.productId}
                text={`${
                  purchasedProductIds.includes(product.productId) ? '✓' : ''
                }${product.title} (${product.localizedPrice})`}
                description={product.description}
                first={i === 0}
                last={i === productList.length - 1}
                onPress={() => this.buySubscribeItem(product.productId)}
                disabled={purchasedProductIds.includes(product.productId)}
              />
            ))}
          </View>

          <View style={{ marginTop: 15 }}>
            <Row
              text={I18n.t('app.main.feedback')}
              onPress={() => {
                navigation.navigate('feedback');
                tracker.logEvent('user-action-feedback');
              }}
            />
          </View>

          <NotificationSetting />
        </ScrollView>

        {!isPremium && (
          <AdMob
            unitId={config.admob[`japanese-${Platform.OS}-about-banner`]}
          />
        )}
      </SafeAreaView>
    );
  }
}
