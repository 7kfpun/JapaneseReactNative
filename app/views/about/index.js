import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';

import * as RNIap from 'react-native-iap';
import DeviceInfo from 'react-native-device-info';
import OneSignal from 'react-native-onesignal';
import RNRestart from 'react-native-restart';
import store from 'react-native-simple-store';

import Backdoor from './components/backdoor';
import NotificationSetting from './components/notification-setting';
import AdMob from '../../elements/admob';
import Row from '../../elements/row';

import { openURL, prepareURL } from '../../utils/helpers';
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
  static navigationOptions = {
    headerTitle: I18n.t('app.about.title'),
  };

  static propTypes = {
    navigation: PropTypes.shape({}).isRequired,
  };

  state = {
    productList: [],
    purchasedProductIds: [],
    isPremium: false,
  };

  componentDidMount() {
    OneSignal.init(config.onesignal, { kOSSettingsKeyAutoPrompt: true });
    store.get('isPremium').then(isPremium => this.setState({ isPremium }));

    this.getProducts();
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
      tracker.logEvent('user-action-restore-purchase');
      const purchases = await RNIap.getAvailablePurchases();
      console.log('getAvailablePurchases', purchases);
      if (purchases && purchases.length > 0) {
        this.setState({
          purchasedProductIds: purchases.map(item => item.productId),
        });

        purchases.forEach(purchase => {
          if (
            purchase.productId === config.inAppProducts[0] ||
            purchase.productId === config.inAppProducts[1]
          ) {
            this.refreshForApplyingPurchase();
          }
          tracker.logEvent('user-action-restore-purchase-done', purchase);
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
      console.warn('Get available error', err.code, err.message);
      tracker.logEvent('user-action-restore-purchase-error', err);

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
      const purchase = await RNIap.buyProduct(product.productId);
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
        tracker.logEvent('user-action-buy-subscription-done', purchase);
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
      tracker.logEvent('user-action-buy-subscription-error', err);
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
      <View style={styles.container}>
        <ScrollView style={{ alignSelf: 'stretch' }}>
          <Backdoor />

          {!isPremium && (
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
            {Platform.OS === 'android' && (
              <Row
                first={false}
                text={I18n.t('app.feedback.tts-instruction')}
                onPress={() => {
                  const uri = prepareURL(
                    I18n.t('app.feedback.tts-instruction-url'),
                    {
                      manufacturer: DeviceInfo.getManufacturer(),
                      model: DeviceInfo.getModel(),
                      name: DeviceInfo.getDeviceId(),
                      type: DeviceInfo.getDeviceName(),
                      version: DeviceInfo.getSystemVersion(),
                      brand: DeviceInfo.getBrand(),
                    }
                  );

                  openURL(uri);
                  tracker.logEvent('user-action-tts-instruction');
                }}
              />
            )}
            <Row
              first={false}
              text={I18n.t('app.feedback.help-translation')}
              description={I18n.t('app.feedback.help-translation-description')}
              onPress={() => {
                Linking.openURL(
                  'https://minna-app.oneskyapp.com/collaboration'
                );
                tracker.logEvent('user-action-help-translation');
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
      </View>
    );
  }
}
