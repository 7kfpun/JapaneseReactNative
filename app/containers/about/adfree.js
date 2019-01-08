import React, { Component } from 'react';

import { Alert, Platform, StyleSheet, ScrollView, View } from 'react-native';

import * as RNIap from 'react-native-iap';
import RNRestart from 'react-native-restart';
import store from 'react-native-simple-store';

import AdMob from '../../components/admob';
import Row from '../../components/row';

import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

const itemSkus = config.inApp.adfree;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
});

type Props = {};
export default class About extends Component<Props> {
  static navigationOptions = {
    headerTitle: I18n.t('app.about.title'),
  };

  state = {
    productList: [],
    purchasedProductIds: [],
  };

  componentDidMount() {
    this.getProducts();
  }

  componentWillUnmount() {
    RNIap.endConnection();
  }

  getProducts = async () => {
    try {
      await RNIap.initConnection();
      const products = await RNIap.getProducts(itemSkus);
      console.log('getProducts', products);
      this.setState({ productList: products });
    } catch (err) {
      console.warn(err);
    }
  };

  getAvailablePurchases = async () => {
    try {
      tracker.logEvent('restore-purchase');
      const purchases = await RNIap.getAvailablePurchases();
      console.log('getAvailablePurchases', purchases);
      if (purchases && purchases.length > 0) {
        this.setState({
          purchasedProductIds: purchases.map(item => item.productId),
        });

        purchases.forEach(purchase => {
          this.checkProduct(purchase);
          tracker.logEvent('restore-purchase-done', purchase);
        });
      } else {
        Alert.alert(
          I18n.t('app.about.restore-failed-title'),
          null,
          [{ text: 'OK' }],
          { cancelable: false }
        );
      }
    } catch (err) {
      console.warn('Get available error', err.code, err.message);
      tracker.logEvent('restore-purchase-error', err);

      return false;
    }
  };

  checkProduct = purchase => {
    if (
      purchase.productId &&
      config.inApp.adfree.includes(purchase.productId)
    ) {
      store.save('isAdfree', true);
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
    tracker.logEvent('buy-subscription', product);
    try {
      console.log('buySubscribeItem:', product);
      let purchase;
      if (config.inApp.adfree.includes(purchase.productId)) {
        purchase = await RNIap.buyProduct(product.productId);
      } else if (config.inApp.premium.includes(purchase.productId)) {
        purchase = await RNIap.buySubscription(product.productId);
      }

      console.info('Purchase result', purchase);

      if (Platform.OS === 'android') {
        setTimeout(() => this.getAvailablePurchases(), 30000);
      }
      // {
      //   transactionId: '1000000441571637',
      //   originalTransactionDate: 1529137617000,
      //   originalTransactionIdentifier: '1000000408046196',
      //   transactionDate: 1536500093000,
      //   transactionReceipt: 'xxxxs=',
      //   productId: 'com.kfpun.japanese.ad'
      // }
      if (
        purchase.productId === config.inAppProducts[0] ||
        purchase.productId === config.inAppProducts[1]
      ) {
        tracker.logEvent('buy-subscription-done', purchase);
        this.refreshForApplyingPurchase();
        tracker.logPurchase(
          product.price.replace(',', '.'),
          product.currency,
          true,
          product.title,
          product.type,
          product.productId
        );
        this.refreshForApplyingPurchase();
      }
    } catch (err) {
      if (err.code === 'E_ALREADY_OWNED') {
        this.getAvailablePurchases();
      }

      console.warn('Purchase result error', err.code, err.message);
      tracker.logEvent('buy-subscription-error', err);
      tracker.logPurchase(
        product.price.replace(',', '.'),
        product.currency,
        false,
        product.title,
        product.type,
        product.productId
      );
    }
  };

  refreshForApplyingPurchase = () => {
    Alert.alert(
      I18n.t('app.about.purchase-title'),
      I18n.t('app.about.purchase-description'),
      [{ text: 'OK', onPress: () => RNRestart.Restart() }],
      { cancelable: false }
    );
  };

  render() {
    const { productList, purchasedProductIds } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={{ alignSelf: 'stretch' }}>
          <View style={{ marginTop: 10 }}>
            {productList.map((product, i) => (
              <Row
                key={product.productId}
                // text={`${
                //   purchasedProductIds.includes(product.productId) ? '✓' : ''
                // }${product.title} (${product.localizedPrice})`}
                text={`${
                  purchasedProductIds.includes(product.productId) ? '✓' : ''
                }${I18n.t('app.about.adfree.title')} (${
                  product.localizedPrice
                })`}
                // description={product.description}
                description={I18n.t('app.about.adfree.description')}
                first={i === 0}
                last={i === productList.length - 1}
                onPress={() => this.buySubscribeItem(product)}
                disabled={purchasedProductIds.includes(product.productId)}
              />
            ))}
          </View>
        </ScrollView>

        <AdMob unitId={config.admob[`${Platform.OS}-about-banner`]} />
      </View>
    );
  }
}
