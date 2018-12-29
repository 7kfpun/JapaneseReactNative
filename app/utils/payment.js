import * as RNIap from 'react-native-iap';

import store from 'react-native-simple-store';

import { getTimestamp } from './helpers';
import tracker from './tracker';

import { config } from '../config';

const getPremiumInfo = async () => {
  const premiumUntil = await store.get('premiumUntil');
  const adFreeUntil = await store.get('adFreeUntil');
  const currentPremiumSubscription = await store.get(
    'currentPremiumSubscription'
  );

  return {
    isPremium: premiumUntil > getTimestamp(),
    isAdFree: adFreeUntil > getTimestamp(),
    premiumUntil,
    adFreeUntil,
    currentPremiumSubscription,
  };
};

const validateReceipt = async purchase => {
  if (purchase.productId && purchase.transactionReceipt) {
    if (config.inApp.adfree.includes(purchase.productId)) {
      // store.save('isAdfree', true);
    } else if (purchase.productId.includes(config.inApp.premiumGroup)) {
      const lastPremiumUntil = await store.get('premiumUntil');
      const lastAdFreeUntil = await store.get('adFreeUntil');

      let premiumUntil;
      let adFreeUntil;
      let currentPremiumSubscription;

      const result = await RNIap.validateReceiptIos(
        {
          'receipt-data': purchase.transactionReceipt,
          password: config.itunesSharedSecret,
        },
        true
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
          currentPremiumSubscription = receiptInfo.expires_date_ms;
        });

        if (premiumUntil > lastPremiumUntil) {
          store.save('premiumUntil', premiumUntil);
        }
        if (adFreeUntil > lastAdFreeUntil) {
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

// Check purchase history
const checkPurchaseHistory = async (isNewConnection = true) => {
  try {
    if (isNewConnection) {
      await RNIap.initConnection();
    }

    const purchaseHistory = await RNIap.getAvailablePurchases();
    console.log('getPurchaseHistory', purchaseHistory);
    if (purchaseHistory.length > 0) {
      let isRenewPremium = false;
      let isRenewAdFree = false;
      purchaseHistory.forEach(purchase => {
        const result = validateReceipt(purchase);
        isRenewPremium = result.isRenewPremium;
        isRenewAdFree = result.isRenewAdFree;
      });

      if (isRenewPremium || isRenewAdFree) {
      }

      return true;
    }
  } catch (err) {
    console.warn(err);
    return false;
  } finally {
    if (isNewConnection) {
      RNIap.isNewConnection();
    }
  }
};

exports.getPremiumInfo = getPremiumInfo;
exports.validateReceipt = validateReceipt;
exports.checkPurchaseHistory = checkPurchaseHistory;
