import React, { Component } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as RNIap from 'react-native-iap';
import RNRestart from 'react-native-restart';
import store from 'react-native-simple-store';

import AdMob from '../../components/admob';
import CustomButton from '../../components/button';

import LifetimeButton from './components/lifetime-button';
import PremiumBanner from './components/premium-banner';
import SubscriptionItem from './components/subscription-item';

import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';
import {
  checkPurchaseHistory,
  getPremiumInfo,
  validateReceipt,
  getPeriod,
} from '../../utils/payment';

import { config } from '../../config';

const subscriptionSkus = config.inApp.premium;
const productSkus = config.inApp.premiumLifetime;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  purchaseBlock: {
    flex: 1,
    padding: 10,
  },
  noteText: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 24,
  },
  noteDescriptionText: {
    fontSize: 12,
    fontWeight: '300',
  },
  restoreBlock: {
    paddingVertical: 10,
  },
});

type Props = {};
export default class Premium extends Component<Props> {
  static navigationOptions = {
    headerTitle: I18n.t('app.about.premium.title'),
  };

  state = {
    subscriptionList: [],
    productList: [],
    selectedProductIndex: null,
  };

  componentDidMount = async () => {
    await RNIap.initConnection();

    this.getStoreSubscription();

    // this.getSubscriptions();
    this.getProducts();
  };

  componentWillUnmount() {
    RNIap.endConnection();
  }

  getStoreSubscription = async () => {
    const premiumInfo = await getPremiumInfo();
    this.setState(premiumInfo);
  };

  getSubscriptions = async () => {
    try {
      const subscriptions = await RNIap.getSubscriptions(subscriptionSkus);
      console.log('getSubscriptions', subscriptions);
      subscriptions.sort((a, b) => a.price - b.price);
      this.setState({
        subscriptionList: subscriptions.filter(i =>
          subscriptionSkus.includes(i.productId)
        ),
      });
    } catch (err) {
      console.warn(err);
    }
  };

  getProducts = async () => {
    try {
      const products = await RNIap.getProducts(productSkus);
      console.log('getProducts', products);
      this.setState({
        productList: products.filter(i => productSkus.includes(i.productId)),
      });
    } catch (err) {
      console.warn(err);
    }
  };

  buySubscribeItem = async product => {
    // {
    //   description: '',
    //   introductoryPrice: '',
    //   subscriptionPeriodNumberIOS: '1',
    //   introductoryPriceNumberOfPeriodsIOS: '',
    //   introductoryPriceSubscriptionPeriodIOS: '',
    //   productId: 'com.kfpun.nihongo.premium.1m',
    //   price: '38',
    //   introductoryPricePaymentModeIOS: '',
    //   type: 'Do not use this. It returned sub only before',
    //   title: '',
    //   subscriptionPeriodUnitIOS: 'MONTH',
    //   localizedPrice: 'HK$38.00',
    //   currency: 'HKD'
    // }
    tracker.logEvent('user-premium-subscription-start', product);
    try {
      console.log('buySubscribeItem:', product);
      let purchase;
      if (config.inApp.adfree.includes(product.productId)) {
        purchase = await RNIap.buyProduct(product.productId);
      } else if (config.inApp.premium.includes(product.productId)) {
        purchase = await RNIap.buySubscription(product.productId);
      }

      console.info('Purchase result', purchase);

      // {
      //   transactionId: '1000000441571637',
      //   originalTransactionDate: 1529137617000,
      //   originalTransactionIdentifier: '1000000408046196',
      //   transactionDate: 1536500093000,
      //   transactionReceipt: 'xxxxs=',
      //   productId: 'com.kfpun.japanese.ad'
      // }

      // {
      //   transactionReceipt: 'xxx',
      //   transactionDate: 1545732911000,
      //   productId: 'com.kfpun.nihongo.premium.1m',
      //   transactionId: '1000000489738811'
      // }
      tracker.logEvent('user-premium-subscription-validate', purchase);
      const result = await validateReceipt(purchase);
      console.log('validateReceipt', result);
      tracker.logEvent('user-premium-subscription-done', result);

      this.restartForApplyingPurchase();
      tracker.logPurchase(
        product.price.replace(',', '.'),
        product.currency,
        true,
        product.title,
        product.type,
        product.productId
      );
    } catch (err) {
      if (err.code === 'E_ALREADY_OWNED') {
        checkPurchaseHistory(false);
        this.restartForApplyingPurchase();
      } else if (err.code === 'E_USER_CANCELLED') {
        // You are currently subscribed || cancelled
      } else if (err.code === 'E_UNKNOWN') {
        Alert.alert(err.code, err.message);
      }

      console.warn('Purchase result error', err.code, err.message);
      tracker.logEvent('user-premium-subscription-error', err);
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

  buyProductItem = async product => {
    // {
    //   description: '',
    //   introductoryPrice: '',
    //   subscriptionPeriodNumberIOS: '0',
    //   introductoryPriceNumberOfPeriodsIOS: '',
    //   introductoryPriceSubscriptionPeriodIOS: '',
    //   productId: '1m',
    //   price: '1000',
    //   introductoryPricePaymentModeIOS: '',
    //   type: 'Do not use this. It returned sub only before',
    //   title: '',
    //   subscriptionPeriodUnitIOS: 'DAY',
    //   localizedPrice: 'HK$1000.00',
    //   currency: 'HKD'
    // }
    tracker.logEvent('user-premium-buy-product-start', product);
    try {
      console.log('buyProductItem:', product);
      let purchase;
      if (config.inApp.premiumLifetime.includes(product.productId)) {
        purchase = await RNIap.buyProduct(product.productId);
      }

      console.info('Purchase result', purchase);
      // {
      //   transactionReceipt: 'xxx',
      //   transactionDate: 1545732911000,
      //   productId: '',
      //   transactionId: '1000000489738811'
      // }
      if (config.inApp.premiumLifetime.includes(purchase.productId)) {
        tracker.logEvent('user-premium-buy-product-done', purchase);
        this.applyLifetimePurchase(purchase);
        this.restartForApplyingPurchase();
      }

      tracker.logPurchase(
        product.price.replace(',', '.'),
        product.currency,
        true,
        product.title,
        product.type,
        product.productId
      );
    } catch (err) {
      if (err.code === 'E_ALREADY_OWNED') {
        this.applyLifetimePurchase();
        this.restartForApplyingPurchase();
      } else if (err.code === 'E_USER_CANCELLED') {
        // You are currently subscribed || cancelled
      } else if (err.code === 'E_UNKNOWN') {
        Alert.alert(err.code, err.message);
      }

      tracker.logEvent('user-premium-buy-product-error', err);
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

  applyLifetimePurchase = purchase => {
    store.save('adFreeUntil', Number.MAX_SAFE_INTEGER);
    store.save('premiumUntil', Number.MAX_SAFE_INTEGER);
    store.save('currentPremiumSubscription', purchase.productId);
  };

  restartForApplyingPurchase = () => {
    Alert.alert(
      I18n.t('app.about.purchase-title'),
      I18n.t('app.about.purchase-description'),
      [
        {
          text: 'OK',
          onPress: () => {
            tracker.logEvent('user-premium-restart');
            RNRestart.Restart();
          },
        },
      ],
      { cancelable: false }
    );
  };

  render() {
    const { subscriptionList, productList, selectedProductIndex } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView>
          <PremiumBanner />

          <FlatList
            key={selectedProductIndex}
            data={subscriptionList}
            renderItem={({ item, index }) => (
              <SubscriptionItem
                onPress={() => this.setState({ selectedProductIndex: index })}
                periodNumber={getPeriod(item.productId).periodNumber}
                periodUnit={
                  getPeriod(item.productId).periodNumber === '1'
                    ? I18n.t(
                        `app.about.premium.${getPeriod(
                          item.productId
                        ).periodUnit.toLowerCase()}`
                      )
                    : I18n.t(
                        `app.about.premium.${getPeriod(
                          item.productId
                        ).periodUnit.toLowerCase()}s`
                      )
                }
                localizedPrice={item.localizedPrice}
                isSelected={selectedProductIndex === index}
              />
            )}
            keyExtractor={item => item.productId}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          <View key={productList.length} style={styles.purchaseBlock}>
            {productList.length === 0 && subscriptionList.length === 0 && (
              <ActivityIndicator size="small" color="gray" />
            )}

            {productList.length > 0 &&
              productList.map(product => (
                <LifetimeButton
                  key={product.productId}
                  price={product.localizedPrice}
                  currency={product.currency}
                  onPress={() => this.buyProductItem(product)}
                />
              ))}

            {subscriptionList.length > 0 && (
              <View style={{ marginTop: 20 }}>
                <CustomButton
                  raised
                  onPress={() => {
                    this.buySubscribeItem(
                      subscriptionList[selectedProductIndex]
                    );
                  }}
                  disabled={selectedProductIndex === null}
                  title={I18n.t('app.about.premium.continue')}
                  titleStyles={{ fontSize: 20 }}
                />
                {subscriptionList.length > 0 && (
                  <View>
                    <Text style={styles.noteText}>
                      {I18n.t('app.about.premium.note')}
                    </Text>
                    <Text style={styles.noteDescriptionText}>
                      {I18n.t('app.about.premium.note-description')}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.restoreBlock}
              onPress={() => {
                const history = checkPurchaseHistory();
                if (!history) {
                  Alert.alert(
                    I18n.t('app.about.restore-failed-title'),
                    null,
                    [{ text: 'OK' }],
                    { cancelable: false }
                  );
                }
              }}
            >
              <Text>{I18n.t('app.about.restore')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <AdMob unitId={config.admob[`${Platform.OS}-about-banner`]} />
      </View>
    );
  }
}
