import * as RNIap from 'react-native-iap';

import store from 'react-native-simple-store';

import { config } from '../config';

const validateReceipt = async purchase => {
  if (purchase.productId && purchase.transactionReceipt) {
    if (config.inApp.adfree.includes(purchase.productId)) {
      // store.save('isAdfree', true);
    } else if (config.inApp.premium.includes(purchase.productId)) {
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
        result.receipt &&
        result.receipt.in_app &&
        result.receipt.in_app.length > 0
      ) {
        result.receipt.in_app.forEach(inApp => {
          store.save('premiumUntil', inApp.expires_date_ms);
          store.save('adFreeUntil', inApp.expires_date_ms);
          store.save('currentPremiumSubscription', inApp.product_id);
        });

        const premiumUntil = await store.get('premiumUntil');
        const adFreeUntil = await store.get('adFreeUntil');
        const currentPremiumSubscription = await store.get(
          'currentPremiumSubscription'
        );

        return {
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
const checkPurchaseHistory = async () => {
  try {
    await RNIap.initConnection();

    const purchaseHistory = await RNIap.getAvailablePurchases();
    console.log('getPurchaseHistory', purchaseHistory);
    purchaseHistory.forEach(purchase => {
      validateReceipt(purchase);
    });
  } catch (err) {
    console.warn(err);
  } finally {
    // RNIap.endConnection();
  }
};

exports.validateReceipt = validateReceipt;
exports.checkPurchaseHistory = checkPurchaseHistory;
