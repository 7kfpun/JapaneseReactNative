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
    purchasedProductIds: [],
    refreshing: false,
    isPremium: false,
  };

  componentDidMount() {
    OneSignal.init(config.onesignal, { kOSSettingsKeyAutoPrompt: true });
    store.get('isPremium').then(isPremium => this.setState({ isPremium }));

    this.getProducts();
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
          purchasedProductIds: purchases.map(item => item.productId),
        });

        purchases.forEach(purchase => {
          if (purchase.productId === config.inAppProducts[0]) {
            this.refreshForApplyingPurchase();
          }
        });
      } else {
        Alert.alert(
          I18n.t('app.about.restore_failed_title'),
          null,
          [{ text: 'OK' }],
          { cancelable: false }
        );
      }
    } catch (err) {
      console.log('Get available error', err.code, err.message);
      console.warn(err.code, err.message);
      return false;
    }
  };

  buySubscribeItem = async product => {
    // {
    //   productId: 'com.kfpun.japanese.ad',
    //   price: '38',
    //   title: 'Premium version',
    //   type: 'Do not use this. It returned sub only before',
    //   currency: 'HKD',
    //   description: 'Remove all banner and popup ads',
    //   localizedPrice: 'HK$38.00'
    // }
    tracker.logEvent('user-action-buy-subscription', product);
    try {
      console.log('buySubscribeItem:', product);
      const purchase = await RNIap.buySubscription(product.productId);
      console.info('Purchase result', purchase);
      if (purchase.productId === config.inAppProducts[0]) {
        tracker.logEvent('user-action-buy-subscription-done', purchase);
        tracker.logPurchase(
          product.price,
          product.currency,
          true,
          product.title,
          product.type,
          product.productId
        );
        this.refreshForApplyingPurchase();
      }
    } catch (err) {
      console.warn('Purchase result error', err.code, err.message);
      tracker.logPurchase(
        product.price,
        product.currency,
        false,
        product.title,
        product.type,
        product.productId
      );
    }
  };

  refreshForApplyingPurchase = () => {
    store.save('isPremium', true);

    Alert.alert(
      I18n.t('app.about.purchase_title'),
      I18n.t('app.about.purchase_description'),
      [{ text: 'OK', onPress: () => RNRestart.Restart() }],
      { cancelable: false }
    );
  };

  render() {
    const { navigation } = this.props;
    const { isPremium, productList, purchasedProductIds } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{ alignSelf: 'stretch' }}>
          {Platform.OS === 'ios' &&
            !isPremium && (
              <View style={{ marginTop: 10 }}>
                {productList.map((product, i) => (
                  <Row
                    key={product.productId}
                    // text={`${
                    //   purchasedProductIds.includes(product.productId) ? '✓' : ''
                    // }${product.title} (${product.localizedPrice})`}
                    text={`${
                      purchasedProductIds.includes(product.productId) ? '✓' : ''
                    }${I18n.t('app.about.purchase_item_title')} (${
                      product.localizedPrice
                    })`}
                    // description={product.description}
                    description={I18n.t('app.about.purchase_item_description')}
                    first={i === 0}
                    last={i === productList.length - 1}
                    onPress={() => this.buySubscribeItem(product)}
                    disabled={purchasedProductIds.includes(product.productId)}
                  />
                ))}

                <Row
                  text={I18n.t('app.about.restore')}
                  onPress={() => {
                    this.getAvailablePurchases();
                    tracker.logEvent('user-action-restore-purchase');
                  }}
                />
              </View>
            )}

          <View style={{ marginTop: 15 }}>
            <Row
              text={I18n.t('app.feedback.feedback')}
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
