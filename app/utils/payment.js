import { Alert } from 'react-native';

import * as RNIap from 'react-native-iap';

import RNRestart from 'react-native-restart';
import store from 'react-native-simple-store';

import { getTimestamp } from './helpers';
import I18n from './i18n';
import tracker from './tracker';

import { config } from '../config';

export const getPremiumInfo = async () => {
  const premiumUntil = await store.get('premiumUntil');
  const adFreeUntil = await store.get('adFreeUntil');
  const currentPremiumSubscription = await store.get(
    'currentPremiumSubscription'
  );

  console.log(
    'getPremiumInfo',
    premiumUntil,
    adFreeUntil,
    currentPremiumSubscription
  );
  const isPremium = premiumUntil > getTimestamp();
  return {
    userType: isPremium ? 'Premium' : 'Normal',
    isPremium,
    isAdFree: adFreeUntil > getTimestamp(),
    premiumUntil,
    adFreeUntil,
    currentPremiumSubscription,
  };
};

export const validateReceipt = async purchase => {
  if (purchase.productId && purchase.transactionReceipt) {
    if (config.inApp.adfree.includes(purchase.productId)) {
      // store.save('isAdfree', true);
    } else if (config.inApp.premiumLifetime.includes(purchase.productId)) {
      store.save('premiumUntil', Number.MAX_SAFE_INTEGER);
      store.save('adFreeUntil', Number.MAX_SAFE_INTEGER);
      store.save('currentPremiumSubscription', purchase.productId);

      return {
        isRenewPremium: true,
        isRenewAdFree: true,
        premiumUntil: Number.MAX_SAFE_INTEGER,
        adFreeUntil: Number.MAX_SAFE_INTEGER,
        currentPremiumSubscription: purchase.productId,
      };
    } else if (purchase.productId.includes(config.inApp.premiumGroup)) {
      const lastPremiumUntil = await store.get('premiumUntil');
      const lastAdFreeUntil = await store.get('adFreeUntil');

      let premiumUntil = 0;
      let adFreeUntil = 0;
      let currentPremiumSubscription;

      const result = await RNIap.validateReceiptIos(
        {
          'receipt-data': purchase.transactionReceipt,
          password: config.itunesSharedSecret,
        },
        __DEV__
      );
      console.log('validateReceiptIos', result);
      if (
        result.status === 0 &&
        result.latest_receipt_info &&
        result.latest_receipt_info.length > 0
      ) {
        result.latest_receipt_info.forEach(receiptInfo => {
          premiumUntil = Math.max(premiumUntil, receiptInfo.expires_date_ms);
          adFreeUntil = Math.max(adFreeUntil, receiptInfo.expires_date_ms);
          currentPremiumSubscription = receiptInfo.product_id;
        });

        if (premiumUntil > lastPremiumUntil || !lastPremiumUntil) {
          store.save('premiumUntil', premiumUntil);
        }
        if (adFreeUntil > lastAdFreeUntil || !lastAdFreeUntil) {
          store.save('adFreeUntil', adFreeUntil);
        }
        store.save('currentPremiumSubscription', currentPremiumSubscription);

        return {
          isRenewPremium: premiumUntil > lastPremiumUntil,
          isRenewAdFree: adFreeUntil > lastAdFreeUntil,
          premiumUntil,
          adFreeUntil,
          currentPremiumSubscription,
        };
      }
    }
  }

  return {};
};

// Check purchase history (restore purchase)
export const checkPurchaseHistory = async (isNewConnection = true) => {
  try {
    if (isNewConnection) {
      await RNIap.initConnection();
    }

    tracker.logEvent('user-premium-restore-purchase-start');
    const purchaseHistory = await RNIap.getAvailablePurchases();
    console.log('getPurchaseHistory', purchaseHistory);
    if (purchaseHistory.length > 0) {
      let isRenewPremiumLast = false;
      let isRenewAdFreeLast = false;

      for (const purchase of purchaseHistory) {
        const result = await validateReceipt(purchase);
        ({ isRenewPremium, isRenewAdFree } = result);
        if (isRenewPremium) isRenewPremiumLast = true;
        if (isRenewAdFree) isRenewAdFreeLast = true;
      }

      if (isRenewPremiumLast || isRenewAdFreeLast) {
        tracker.logEvent('user-premium-restore-purchase-done');

        Alert.alert(
          I18n.t('app.about.purchase-title'),
          I18n.t('app.about.purchase-description'),
          [
            {
              text: 'OK',
              onPress: () => {
                tracker.logEvent('user-premium-restore-purchase-restart');
                RNRestart.Restart();
              },
            },
          ],
          { cancelable: false }
        );
      }

      return true;
    }
  } catch (err) {
    tracker.logEvent('user-premium-restore-purchase-error', err);
    console.warn(err);
    return false;
  } finally {
    if (isNewConnection) {
      RNIap.endConnection();
    }
  }
};

export const getPeriod = productId => {
  const splited = productId.split('.');
  const period = splited[splited.length - 1]; // get last part, "3m", "6m", "12m"
  const periodNumber = period.replace('m', '');

  if (Number.isNaN(periodNumber)) {
    return {
      periodNumber: '0',
      periodUnit: 'DAY',
    };
  }

  if (period.endsWith('d')) {
    return {
      periodNumber,
      periodUnit: 'DAY',
    };
  } else if (period.endsWith('m')) {
    return {
      periodNumber,
      periodUnit: 'MONTH',
    };
  } else if (period.endsWith('y')) {
    return {
      periodNumber,
      periodUnit: 'YEAR',
    };
  }

  return {
    periodNumber: '0',
    periodUnit: 'DAY',
  };
};
