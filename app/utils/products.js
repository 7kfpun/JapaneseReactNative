import * as RNIap from 'react-native-iap';

import { config } from '../config';

const itemSkus = config.inAppProducts;

export const checkAdRemoval = async () => {
  try {
    const purchases = await RNIap.getAvailablePurchases();
    return purchases && purchases.length > 0 && purchases.filter(item => item.productId === itemSkus[0]).length > 0;
  } catch (err) {
    console.log('checkAdRemoval error', err.code, err.message);
    return false;
  }
};

export const noop = () => {};
