import { Linking, Platform } from 'react-native';

import SafariView from 'react-native-safari-view';
import Tts from 'react-native-tts';

// Open Safari browser on iOS, a new app browser on Android
export const openURL = url => {
  tempUrl = encodeURI(url);
  if (Platform.OS === 'ios') {
    SafariView.isAvailable()
      .then(
        SafariView.show({
          url: tempUrl,
        })
      )
      .catch(error => {
        console.log(error);
        Linking.openURL(tempUrl);
      });
  } else {
    Linking.openURL(tempUrl);
  }
};

// Returns a new list containing elements from the population while leaving the original population unchanged.
export const shuffle = a => {
  let j;
  let x;
  let i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};

export const cleanWord = text =>
  text
    .replace(/（.*?）/g, '')
    .replace(/［.*?］/g, '')
    .replace(/「.*?」/g, '')
    .replace(/\[.*\]/g, '')
    .replace(/～/g, '')
    .replace(/。/g, '');

// Return a randomly selected element from range(start, stop, step).
export const range = (start, stop, step = 1) =>
  Array((stop - start) / step)
    .fill(start)
    .map((x, y) => x + y * step);

// Flatten a list of lists of elements into a list of elements.
export const flatten = arr =>
  arr.reduce(
    (flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten),
    []
  );

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Return a random element from the non-empty list.
export const choice = arr => arr[Math.floor(Math.random() * arr.length)];

// Return a random integer N such that 0 <= N <= max.
export const randomInt = max => Math.floor(Math.random() * Math.floor(max));

export const prepareURL = (url, replacers) => {
  let tempUrl = url;
  Object.keys(replacers).forEach(key => {
    value = replacers[key];
    tempUrl = tempUrl.replace(`{${key}}`, value);
  });
  return tempUrl;
};

// No operation function.
export const noop = () => {};

// TTS speaking
export const ttsSpeak = (item, lang = 'ja') => {
  if (item.kanji && item.kana) {
    // Tts.stop();
    Tts.setDefaultLanguage(lang);
    Tts.speak(
      cleanWord(
        item.useKana || Platform.OS === 'android' ? item.kana : item.kanji
      )
    );
  }
};

// Get timestamp
export const getTimestamp = () => new Date().getTime();
